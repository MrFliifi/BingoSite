const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");

// Imports the config.js file
const {
  domain,
  frontPort,
  backPort,
  frontAdress,
  backAdress,
} = require("./config.js");

// Integrates CORS into the Express-App, so the frontend can communicate with the backend
app.use(cors());
// Safety Feature for HTTP-Header
app.use(helmet());
// Parses incoming requests with JSON payloads, makes it readable for the backend
app.use(express.json());
// Parses incoming requests with urlencoded payloads, makes HTML Forms readable for the backend
app.use(express.urlencoded({ extended: false }));


// Creates the HTTP-Server
const httpServer = require("http").createServer(app);

// Port for the backend
httpServer.listen(backPort, () => {
    console.log(`Server running on port ${backPort}`);
  });

// CORS for the Socket.io Server, so the backend can receive requests from "frontAdress"
const options = {
  cors: {
    origin: frontAdress,
    methods: ["GET", "POST"],
    credentials: true,
  },
};

// Creates Socket.io Object and links it to the express HTTP-Server and the cors options that accepts our "frontAdress" as a valid origin
const io = require("socket.io")(httpServer, options);


// imports the logik back to the server.js file
require("../socket/socket-events.js")(io);



