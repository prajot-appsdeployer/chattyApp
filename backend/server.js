const app = require("express")();
const server = require("http").createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

let onlineUsers = [];

const addNewUser = (username, socketId) => {
  !onlineUsers.some((user) => user.username === username) &&
    onlineUsers.push({ username, socketId });
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (username) => {
  return onlineUsers.find((user) => user.username === username);
};

io.on("connection", (socket) => {
  console.log(socket.adapter.sids);

  socket.on("newUser", (username) => {
    addNewUser(username, socket.id);
  });

  socket.on("chat", (payload) => {
    io.emit("chat", payload);
  });

  socket.on("send-notification", ({ senderName, message }) => {
    io.emit("get-notification", {
      senderName,
      message,
    });
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});

server.listen(5000, () => {
  console.log("Server is running on port 5000...");
});
