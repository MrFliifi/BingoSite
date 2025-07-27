// backend server.js
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

// CORS for the Socket.io Server, so the backend can receive requests from "frontAdress"
const options = {
  cors: {
    origin: frontAdress,
    methods: ["GET", "POST"],
    credentials: true,
  },
};

// Integrates CORS into the Express-App, so the frontend can communicate with the backend
app.use(cors(options));
// Safety Feature for HTTP-Header
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "wss://bingo-app-cv3k.onrender.com"],
    },
  })
);

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



// Creates Socket.io Object and links it to the express HTTP-Server and the cors options that accepts our "frontAdress" as a valid origin
const io = require("socket.io")(httpServer, options);


const path = require("path");
const buildPath = path.resolve(__dirname, "../../frontend/build");

console.log(buildPath);


// Telling Express where to find our Frontend
app.use(express.static(buildPath));

// Specify which File to serve to the Client. We need only the Index.html, cause of our one-page Router Design.
app.get("/{*any}", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

//Monitoring to check if Server is still running
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});


// imports the logik back to the server.js file
require("../socket/socket-events.js")(io);



