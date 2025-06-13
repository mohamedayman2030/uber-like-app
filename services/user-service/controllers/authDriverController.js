import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import promisify from 'util';
import { Driver } from '../Models/driversModel.js';
import util from 'node:util';

const driver = new Driver();

const createToken = (id)=>{
    const token = jwt.sign({id:id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRY});

    return token;
}

export const signup = async (req,res,next)=>{
      const name = req.body.name;
      const email = req.body.email;
      const phone = req.body.phone;
      const photo = req.body.photo;
      const vehicle_type = req.body.vehicle_type;
      const vehicle_name = req.body.vehicle_name;
      const vehicle_no = req.body.vehicle_no;

      if(!name || !email || !phone || !photo || !vehicle_type || !vehicle_name || !vehicle_no || !req.body.password){
        return res.status(400).json({
            status: 'failed',
            message: 'missed information'
        })
      }
     try{

      const existingUser = await driver.showByEmail(email);

      if(existingUser){
        return res.status(400).json({
            status: 'failed',
            message: 'already created user'
        })
      }

      console.log(req.body);

      const createdUser = await driver.create({
        name,
        email,
        phone,
        photo,
        password: req.body.password,
        vehicle_name,
        vehicle_type,
        vehicle_no,
      })

      if(createdUser){

        const token = createToken(createdUser.id);

        return res.status(201).json({
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
        console.error(error);
        return res.status(500).json({
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

    const existingUser = await driver.showByEmail(email);
    if(!existingUser){
        return res.status(400).json({
            status: 'failed',
            message: 'wrong email or password'
        })
    }

     
    const correctPassword = await driver.isCorrectPassword(existingUser.password,req.body.password);
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

    const decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET);

    const existingUser = await driver.show(decoded.id);
  //user might be deleted or not exist and this token is incorrect
    if(!existingUser){
        return res.status(400).json({
            status: 'failed',
            message: 'user with this token does not exist'
        })
    }

    // password might be changed after getting the 
    const changed = await driver.changedThePasswordAfterJWT(decoded.iat,decoded.id);

    if(changed){
        return res.status(400).json({
            status: 'failed',
            message: 'incorrect password, please login again'
        })
    }

   next();
}

export const authDriverSocket = async (socket,next)=>{
    try{
     const token = socket.handshake.headers.token;

    const decoded = await util.promisify(jwt.verify)(token,process.env.JWT_SECRET);
    
    const existingUser = await driver.show(decoded.id);

    if(!existingUser){
        console.log('user not found');
       throw new Error('user is not found');
    }

    const changed = await driver.changedThePasswordAfterJWT(decoded.iat,decoded.id);

    if(changed){
        console.log('incorrect password');
        throw new Error('incorrect password, please login again');
    }
    socket.user = existingUser;
    next();

}catch(error){
    console.log('authenctication error',error);

    next(new Error('authentication issue, please login or signup'));
}
}