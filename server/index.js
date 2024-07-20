const express = require("express");
require("dotenv").config();
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = createServer(app);
const userRouter = require("./routes/users");
const dbconfig = require("./utils/dbconfig");
const authMiddleware = require("./middlewares/authMiddleware");
const clanRouter = require("./routes/clans");
const messageRouter = require("./routes/messages");

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/users", userRouter);
app.use("/api/clans", clanRouter);
app.use("/api/messages", messageRouter);

io.on("connection", (socket) => {
  console.log(socket.id);
  console.log("New user connected to  socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log("setup");
    // socket.emit("connected");
  });

  socket.on("join-chat", (roomID) => {
    socket.join(roomID);
    console.log("User Joined Room: " + roomID);
  });

  socket.on("new-message", (newmessage, clan) => {
    var clanId = newmessage.clanId;

    // console.log("New message send:", newmessage, clan);

    clan?.members.forEach((user) => {
      if (user._id === newmessage.sender) return;

      socket.in(user._id).emit("message-received", newmessage);
    });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server Listening on Port ${PORT}`);
});
