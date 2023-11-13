const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const Oauth = require("./routes/oauth");
const Message = require("./models/Message");
const cors = require("cors");
const ConnectDB = require("./connections/db");
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});

require("dotenv").config();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//api routes bidzi
app.use("/oauth", Oauth);

io.on("connection", (socket) => {
  console.log("User Connected");

  //events
  socket.on("sendingMessage", async (data) => {
    try {
      const newMessage = new Message({
        name: data.name,
        mail: data.mail,
        message: data.message,
        photo: data.photo,
      });
      await newMessage.save();
      io.emit("chatMessage", data);
    } catch (error) {
      console.log("something wrong with it", "\n", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected");
  });
});

const PORT = process.env.PORT || 3000;
const StartServer = async () => {
  try {
    ConnectDB(process.env.URL);
    server.listen(PORT);
    console.log(`listening on ${PORT}`);
  } catch (error) {
    console.log("Something wrong here ", "\n", error);
  }
};
StartServer();
