import { NextApiRequest, NextApiResponse } from "next";
import { Server, Socket } from "socket.io";

// let count = 0;

export default function SocketHandler(req: any, res: any) {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");

    const io = new Server(res.socket.server, {
      // path: "/api/socketio"
      // addTrailingSlash: false,
    });
    res.socket.server.io = io;

    io.on("connection", socket => {
      console.log("on connection");
    });

    io.emit("test", "test");
  }
  res.end();
}
