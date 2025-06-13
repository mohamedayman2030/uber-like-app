import dotenv from 'dotenv';
import pg from 'pg';

const {Pool} = pg;


dotenv.config();


const {POSTGRES_HOST,POSTGRES_DB,POSTGRES_USER,POSTGRES_PASSWORD,POSTGRES_PORT} = process.env;


const client = new Pool({
    host:POSTGRES_HOST,
    database: POSTGRES_DB,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    port:POSTGRES_PORT
});

client.connect()
  .then(() => console.log("Connected successfully"))
  .catch(err => console.error("Connection error:", err.stack));

export default client;

