import {S2} from 's2-geometry';
import { redisGetSortedSet } from "../../../database/redis.js";


export const findDriver = async (lat, lng)=>{

    let allNearestDrivers=[];
   
    let neighbors = S2.latLngToNeighborKeys(lat,lng,12);

    let maincell = S2.latLngToKey(lat,lng,12);

    let driversInMainCell = await redisGetSortedSet(maincell);
    allNearestDrivers.push(driversInMainCell);
    for(const neighbor of neighbors){
         let driversByCell = await redisGetSortedSet(neighbor);
         allNearestDrivers.push(driversByCell);
    }

    console.log(allNearestDrivers);
    return allNearestDrivers;

}