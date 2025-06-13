import express from 'express';
import { createServer } from 'http';
import bodyParser from 'body-parser';
import { CreateSocketServer } from './socket.js';
import { updateDriverLocation } from './services/location-service/controllers/DriverLocation.js';
import { redisSetSocketSessionForDriver,redisSetSocketSessionForRider,redisConnectforLocationClient,redisConnectforSocketSessionClient } from './database/redis.js';
import { authDriverSocket } from './services/user-service/controllers/authDriverController.js';
import { authUserSocket } from './services/user-service/controllers/authUserController.js';
import { driverRouter } from './services/user-service/routes/driverRouter.js';
import { userRouter } from './services/user-service/routes/userRouter.js';
import { requestRide } from './services/trip-service/RequestVehicle.js';

redisConnectforLocationClient();
redisConnectforSocketSessionClient();
const app = express();

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use('/authenticate-driver',driverRouter);

app.use('/autheticate-rider',userRouter);

const server = createServer(app);

export let io = CreateSocketServer(server);



export const driversNameSpace = io.of("/drivers");

export const ridersNameSpace = io.of("/riders");

driversNameSpace.use(authDriverSocket);

ridersNameSpace.use(authUserSocket);

driversNameSpace.on("connection", async (socket) => {
  console.log("A driver connected:", socket.id);
   
  socket.on("startReceivingRides",async(data)=>{
    let body = JSON.parse(data);
    await redisSetSocketSessionForDriver(body.driverID, socket.id);
  })

  socket.on("updateDriverLocation",async (data)=>{
    let body = JSON.parse(data);
    await updateDriverLocation(body);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

ridersNameSpace.on("connection",async (socket)=>{
  console.log("A rider connected", socket.id);
  socket.on("start",async(data)=>{
    let body = JSON.parse(data);
  await redisSetSocketSessionForRider(socket.id, body.riderID);
  })
  socket.on("requestRide",async(data)=>{
    let body = JSON.parse(data);
     await requestRide(body,socket.id);
  });

  
})

app.use((req,res,next)=>{
req.io = io;

next();
})






// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
