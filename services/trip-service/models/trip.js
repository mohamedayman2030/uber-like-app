import client from "../../../database/postgres.js";


export class Trip{
    async create(trip){
        try{
        const conn = await client.connect();

        const sql = "INSERT INTO trips (rider_id, driver_id,location, ETA, status) VALUES ($1,$2,$3,$4,$5)";

        const result = await conn.query(sql,[Number(trip.riderID),Number(trip.driverID),trip.location,Number(trip.ETA),trip.status]);

        conn.release();

        return result.rows[0];
        }catch(err){
            throw new Error(`Could not add new trip. Error: ${err}`);
        }
    }
}