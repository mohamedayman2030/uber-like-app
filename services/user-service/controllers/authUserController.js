import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import promisify from 'util';
import util from 'node:util';
import { Rider } from '../Models/ridersModel.js';

const rider = new Rider();

const createToken = (id)=>{
    const token = jwt.sign({id:id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRY});

    return token;
}

export const signup = async (req,res,next)=>{
      const name = req.body.name;
      const email = req.body.email;
      const phone = req.body.phone;
     try{

      const existingUser = await rider.showByEmail(email);

      if(existingUser){
        res.status(400).json({
            status: 'failed',
            message: 'already created user'
        })
      }

      const createdUser = await rider.create({
        name,
        email,
        phone,
        password: req.body.password
      })

      if(createdUser){

        const token = createToken(createdUser.id);

        res.status(201).json({
            status: 'success',
            message: 'created user successfully',
            token,
            user: {
                id: createdUser.id,
                name: createdUser.name,
                email: createdUser.email,
                phone: createdUser.phone,
                photo: createdUser.photo,
              },
        })
      }
    }catch(error){
        res.status(500).json({
            status: 'failed',
            message: "can't create a new user"
        })
    }
}



export const login = async (req,res,next)=>{
    try{
    if(!req.body.email || !req.body.password){
        return res.status(400).json({
            status: 'failed',
            message: 'please provide the email and the password'
        })
    }

    const email = req.body.email;

    const existingUser = await rider.showByEmail(email);
    if(!existingUser){
        return res.status(400).json({
            status: 'failed',
            message: 'wrong email or password'
        })
    }
     
    const correctPassword = await rider.isCorrectPassword(existingUser.password,req.body.password);
    if(correctPassword){
         
        const token = createToken(existingUser.id);

        res.status(200).json({
            status: 'success',
            token
        })
    }else{
        res.status(400).json({
            status: 'failed',
            message: 'wrong email or password'
        })
    }
        
    }catch(error){
        console.log(error);
        res.status(500).json({
            status: "error",
            message: "An error occurred while logging in",
        });
    }


}

export const auth = async (req,res,next)=>{
    let token='';
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }

    if(!token){
        return res.status(400).json({
            status: 'failed',
            message: 'you are not logged in, please login to get access'
        })
    }
    // verify token
    const decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET);
    // verify the existance of the user ( might not be existed)
    const existingUser = await rider.show(decoded.id);

    if(!existingUser){
        return res.status(400).json({
            status: 'failed',
            message: 'user with this token does not exist'
        })
    }

    // check if the user changed the password after generating the token

    const changed = await rider.changedThePasswordAfterJWT(decoded.iat,decoded.id);

    if(changed){
        return res.status(400).json({
            status: 'failed',
            message: 'incorrect password, please login again'
        })
    }

   next();
}


export const authUserSocket = async (socket,next)=>{
    try{
     const token = socket.handshake.headers.token;

    const decoded = await util.promisify(jwt.verify)(token,process.env.JWT_SECRET);
    
    const existingUser = await rider.show(decoded.id);

    if(!existingUser){
       throw new Error('user is not found');
    }

    const changed = await rider.changedThePasswordAfterJWT(decoded.iat,decoded.id);

    if(changed){
        throw new Error('incorrect password, please login again');
    }
    socket.user = existingUser;
    next();

}catch(error){
    console.log('authenctication error',error);

    next(new Error('authentication issue, please login or signup'));
}
}