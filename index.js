const path = require("path");
const express = require("express");
const app = express();

app.set("port", process.env.PORT || 4000);
//static files
app.use(express.static(path.join(__dirname, "src")));
//start server
const server = app.listen(app.get("port"), () => {
  console.log(`Server on port ${app.get("port")}`);
});

//websockets
const SocketIO = require("socket.io");
const io = SocketIO(server);
io.on("connection", (socket) => {
  console.log("new conection", socket.id);
  io.to(socket.id).emit("chat:user_id", socket.id);
  socket.on("zone:change", (data) => {
    console.log("change zone");
    data.socket = socket.id;
    io.sockets.emit("zone:change", data);
  });
  socket.on("chat:message", (data) => {
    console.log(data);

    switch (data.type) {
      case "to":
        io.to(socket.id).emit("chat:message", data);
        break;
      case "all":
        /* envia a todoa los usuarios incluyendo al emisor */
        io.sockets.emit("chat:message", data);
        break;
    }
  });
  socket.on("chat:typing", (data) => {
    console.log(data);
    /* envia a todoa los usuarios excluyendo al emisor */
    socket.broadcast.emit("chat:typing", data);
  });
});
