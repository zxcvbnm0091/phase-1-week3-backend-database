import express from "express";
import { createServer } from "http";
import { Server } from "socket.io"; // Use named export

const port = 4001;
const app = express();
const server = createServer(app);

// Initialize with 'new Server' and add CORS
const io = new Server(server, {
  cors: {
    origin: "*", // Or your specific frontend URL like "http://localhost:5173"
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("change color", (color) => {
    console.log("Color received:", color);
    // 'io.emit' is the modern way to send to everyone
    io.emit("change color", color);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
