import client from "../../../database/postgres.js";
import bcrypt from 'bcryptjs';


export class Rider {
    async index(){
        try{
        const conn = await client.connect();
        const sql = 'select * from riders';
        const result = await conn.query(sql);
        conn.release();
        return result.rows;
        }catch(err){
            throw new Error(`Could not get all users. Error: ${err}`)
        }
    }

    async create(rider){
        try{
            const conn = await client.connect();
            const sql = 'INSERT INTO riders (name,password,email,photo,phone) VALUES ($1,$2,$3,$4,$5) RETURNING *';
            const hashedPassword = await this.hashedPassword(rider.password);
            const result = await conn.query(sql,[rider.name,hashedPassword,rider.email,rider.photo,rider.phone]);
            conn.release();
            return result.rows[0];
        }catch(err){
            throw new Error(`Could not add new user. Error: ${err}`);
        }
    }

    async delete(id){
        try{
              const conn = await client.connect();
              const sql = 'DELETE FROM riders WHERE id = ($1)';
              const result = await conn.query(sql,[id]);
              conn.release();
              return result.rows[0];
        }catch(err){
            throw new Error(`Could not add new user. Error: ${err}`);
        }
    }

    async show(id){
        try{
            const conn = await client.connect();
            const sql = 'SELECT * FROM riders WHERE id = ($1)';
            const result = await conn.query(sql,[id]);
            conn.release();
            return result.rows[0];
      }catch(err){
          throw new Error(`Could not add new user. Error: ${err}`);
      }
    }

    async showByEmail(email){
        try{
            const conn = await client.connect();
            const sql = 'SELECT * FROM riders WHERE email = ($1)';
            const result = await conn.query(sql,[email]);
            conn.release();
            return result.rows[0];
      }catch(err){
          throw new Error(`Could not add new user. Error: ${err}`);
      }
    }

    async hashedPassword(password){
        let hashedPassword = await bcrypt.hash(password,parseInt(process.env.SALT_ROUNDS));
        return hashedPassword;
    }

    async isCorrectPassword(DBpassword,userPassword){
        return await bcrypt.compare(userPassword,DBpassword);
    }

    async changedThePasswordAfterJWT(JWTCreationTime, userID){
             let result = await this.show(userID);

             let passwordChangedDate = new Date(result.password_updated_at);

             let JWTDateInMilliSeconds = new Date(JWTCreationTime*1000);


             return passwordChangedDate> JWTDateInMilliSeconds;
    }
}