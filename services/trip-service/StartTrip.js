import axios from "axios";
import dotenv from 'dotenv';
import { redisGetSocketSessionForRider } from "../../database/redis.js"
import { Trip } from "./models/trip.js";

dotenv.config();

const apiKey = process.env.OPEN_ROUTE_API_KEY

let tripModel = new Trip();

export const startTrip = async (userSocketID,driverID,tripCoordinates)=>{
   const riderID = await redisGetSocketSessionForRider(userSocketID);
   console.log('the rider id is: ',riderID);
   const tripEstimations = await axios.get(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${tripCoordinates.long},${tripCoordinates.lat}&end=${tripCoordinates.targetedlong},${tripCoordinates.targetedlat}`);
   const ETAinSeconds = tripEstimations.data.features[0].properties.summary.duration;
   const ETAinMinutes = Math.round((ETAinSeconds / 60).toFixed(1));
   const tripDetails = {
      riderID: Number(riderID),
      driverID: Number(driverID),
      location: 'testLocation',
      ETA: ETAinMinutes,
      status: 'ACCEPTED'
   }
   const createdTrip = await tripModel.create(tripDetails);
}