import { Redis } from "ioredis";


const redisClient = new Redis({
    db: 1,
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
});

const redisClientforDriverSocketSession = new Redis({
    db: 2,
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
});

const redisClientforRiderSocketSession = new Redis({
    db: 3,
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
})


export const redisConnectforLocationClient = async ()=>{
    redisClient.on("connect", () => console.log("Connected to Redis of location client"));
    redisClient.on("ready", () => console.log("Redis is ready to use"));
}

export const redisConnectforSocketSessionClient = async ()=>{
    redisClientforDriverSocketSession.on("connect", () => console.log("Connected to Redis of socket session client"));
    redisClientforDriverSocketSession.on("ready", () => console.log("Redis is ready to use"));
}

export const redisSetSortedSet = async (key,value)=>{
    try{
    

    await redisClient.zadd(key,Date.now(),value);
    }catch(error){
        console.error(`Redis error: ${err.message}`, error);
        throw new Error(`Failed to set key: ${key} in Redis`);
    }
}

export const redisGetSortedSet = async(key)=>{
    try{
         let value = await redisClient.zrevrange(key,0,-1);
         return value;
    }catch(error){
        console.error(`Redis error: ${err.message}`, error);
        throw new Error(`Failed to set key: ${key} in Redis`);
    }
}


export const extendTTL = async(key, additionalSeconds)=>{

    const TTL = await redisClient.ttl(key);
    try{
    if(TTL>0){
        const newTTL = TTL+additionalSeconds;

        await redisClient.expire(key,newTTL);

        return true;
    }else{
        return false;
    }
}catch(error){
    console.error("can't update the ttl",error.message);
}
   
}

export const redisSetSocketSessionForDriver= async (key, value) => {
try{
  await redisClientforDriverSocketSession.set(key,value);
}catch(error){
    console.error(`Redis error: ${err.message}`, error);
    throw new Error(`Failed to set key: ${key} in Redis`);
}
}


export const redisGetSocketSessionForDriver = async(key)=>{
    try{
         let value = await redisClientforDriverSocketSession.get(key);
         return value;
    }catch(error){
        console.error(`Redis error: ${err.message}`, error);
        throw new Error(`failed to get the key ${key}`);
    }
}


export const redisSetSocketSessionForRider = async (key, value) => {
    try{
      await redisClientforRiderSocketSession.set(key,value);
    }catch(error){
        console.error(`Redis error: ${err.message}`, error);
        throw new Error(`Failed to set key: ${key} in Redis`);
    }
    }
    
    
    export const redisGetSocketSessionForRider = async(key)=>{
        try{
             let value = await redisClientforRiderSocketSession.get(key);
             return value;
        }catch(error){
            console.error(`Redis error: ${err.message}`, error);
            throw new Error(`failed to get the key ${key}`);
        }
    }