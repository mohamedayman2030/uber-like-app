import client from "../../../database/postgres.js";
import bcrypt from 'bcryptjs';


export class Driver {
    async index(){
        try{
        const conn = await client.connect();
        const sql = 'select * from drivers';
        const result = await conn.query(sql);
        conn.release();
        return result.rows;
        }catch(err){
            throw new Error(`Could not get all users. Error: ${err}`)
        }
    }

    async create(driver){
        console.log(driver);
        try{
            const conn = await client.connect();
            const sql = 'INSERT INTO drivers (username,password,email,photo,phone,vehicle_type,vehicle_name,vehicle_no) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *';
            const hashedPassword = await this.hashedPassword(driver.password);
            console.log(hashedPassword);
            const result = await conn.query(sql,[driver.name,hashedPassword,driver.email,driver.photo,driver.phone,driver.vehicle_type,driver.vehicle_name,driver.vehicle_no]);
            console.log(result);
            conn.release();
            return result.rows[0];
        }catch(err){
            throw new Error(`Could not add new user. Error: ${err}`);
        }
    }

    async delete(id){
        try{
              const conn = await client.connect();
              const sql = 'DELETE FROM drivers WHERE id = ($1)';
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
            const sql = 'SELECT * FROM drivers WHERE id = ($1)';
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
            const sql = 'SELECT * FROM drivers WHERE email = ($1)';
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