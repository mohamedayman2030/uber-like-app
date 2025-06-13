import { redisSetSortedSet } from "../../../database/redis.js";
import { S2 } from "s2-geometry";
import {DriverLocation } from "../models/DriverLocation.js";

const LocationToPostgres = new DriverLocation();
export const updateDriverLocation = async (data)=>{
   let key = S2.latLngToKey(data.newlat,data.newlong,12);
   try {
     await redisSetSortedSet(key,data.driverID);
     await LocationToPostgres.create({
      driverID: data.driverID,
      oldlat: data.oldlat,
      oldlong: data.oldlong,
      newlat:data.newlat,
      newlong:data.newlong
     })
   }catch(err){
       console.log(err);
   }
}