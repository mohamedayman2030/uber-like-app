import client from "../../../database/postgres.js";


export class DriverLocation{
    async create(DriverLocation){
        try{
            const conn = await client.connect();
            const sql = 'INSERT INTO driver_location (old_latitude,old_longitude,new_latitude,new_longitude,driver_id) VALUES ($1,$2,$3,$4,$5) RETURNING *';
            const result = await conn.query(sql,[DriverLocation.oldlat,DriverLocation.oldlong,DriverLocation.newlat,DriverLocation.newlong,DriverLocation.driverID]);
            conn.release();
            return result.rows[0];
        }catch(err){
            throw new Error(`Could not add new user. Error: ${err}`);
        }
    }
}