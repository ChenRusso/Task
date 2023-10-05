const express = require('express');
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require('cors');

app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("send_message", (data) => {
    io.emit("receive_message", data);
  });

  socket.on("typing", () => {
    socket.broadcast.emit("user_typing", { id: socket.id });
  });

  socket.on("stop_typing", () => {
    socket.broadcast.emit("user_stop_typing", { id: socket.id });
  });
});


server.listen(3001, () => {
  console.log("Server is running on port 3001");
});
