const http = require("http");
const express = require("express");
const mqtt = require("mqtt");
const cors = require("cors");
const socketio = require("socket.io");

const options = {
  username: "student",
  password: "austral-clash-sawyer-blaze",
  rejectUnauthorized: true,
};

const client = mqtt.connect("mqtt://mqtt.cci.arts.ac.uk:1883/", options);

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000", // replace with your origin
  })
);
app.use(express.static("public"));
app.set("port", "8080");

const server = http.createServer(app);

const io = socketio(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
  transports: ["websocket"], // Ensure using websocket transport
  allowEIO3: true,
});

server.on("listening", () => {
  console.log("Listening on port 8080");
});

server.listen(8080, "127.0.0.1");

io.on("connection", (socket) => {
  console.log("Client connected: " + socket.id);

  socket.on("disconnect", () => console.log("Client has disconnected"));
});

//send data from MQTT server to client
client.on("message", function (topic, message) {
  let data = String.fromCharCode.apply(null, message);
  console.log("message: " + message);
  let data_array = data.split(",");
  console.log("data_array: " + data_array);
  io.sockets.emit("data_array", data_array);
});

client.on("connect", () => {
  console.log("Connected!");
});

client.on("error", (error) => {
  console.log("Error:", error);
});

//subscribe to MQTT topic
client.subscribe("airgradient/readings/0cb815082660");
