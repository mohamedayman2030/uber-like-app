import { findDriver } from "../location-service/controllers/FindDriver.js";
import { redisGetSocketSessionForDriver } from "../../database/redis.js";
import { driversNameSpace } from "../../index.js";
import { startTrip } from "./StartTrip.js";


export const requestRide = async (body,userSocketID)=>{

    let tripCordinates = {
        lat: body.lat,
        long: body.long,
        targetedlat:body.targetedlat,
        targetedlong: body.targetedlong
    }
    
    let allNearestDrivers = await findDriver(tripCordinates.lat,tripCordinates.long);

   

    for(let i=0;i<allNearestDrivers.length;i++){
        for(let j=0;j<allNearestDrivers[i].length;j++){
            let isAccepted = await sendTripDetailsToDriver(userSocketID,tripCordinates,allNearestDrivers[i][j]);
            if(isAccepted){
                startTrip(userSocketID,allNearestDrivers[i][j],tripCordinates);
            }
        }
    }

}


const sendTripDetailsToDriver = async (userSocketID,tripCordinates,nearestDriver)=>{
         
         let socketSessionID = await redisGetSocketSessionForDriver(nearestDriver);
         console.log("📡 Socket Session ID:", socketSessionID);
         return new Promise((resolve,reject)=>{
            driversNameSpace.to(socketSessionID).timeout(30000).emit("tripCoordinates",tripCordinates,(error,response)=>{
                if(error){
                    resolve(false);
                }
                else if(!response[0].result){
                   resolve(false);
                }
                else if (response[0].result){
                    
                    resolve(true);
                }
             });
         })
         
}