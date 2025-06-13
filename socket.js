import { Server } from 'socket.io';





export const CreateSocketServer = (server) => {
   const io = new Server(server,{
     cors: {
       origin: "*",
     }
   })

  return io;

}





