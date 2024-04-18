require('dotenv').config();
const express = require("express");
const cors = require("cors");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
const bp = require("body-parser");
const { Session } = require("@inrupt/solid-client-authn-node");
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

// ============== APPLICATION CONFIGURATIONS ==========
const app = express();
const PORT = 8080;
const mongoUri = process.env.MONGO_URI;

// ============== APPLICATION MODULES ================
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(bp.json()); // allows to send data to our express routes in a JSON format

app.use(cookieParser());

mongoose.connect(mongoUri)
.then(console.log("Succesfully connected to MongoDB"));

app.listen(PORT, () => {
  console.log("Server started on port " + PORT);
});

const googleRouter = require('./routes/google');
const githubRouter = require('./routes/github');

// ######### ROUTES #########
// -> GOOGLE
app.use(googleRouter);

// -> GITHUB
app.use(githubRouter);

// INRUPT ->

app.get("/getProfile", async function (req, res) {
  // create session object
  // const session = new Session();
  // session.login({
  //     redirectUrl: "http://localhost:3000",
  //     oidcIssuer: "https://login.inrupt.com",
  // }).then(() => {
  //     if (session.info.isLoggedIn){
  //         // send the webID to the frontend
  //         res.send(session.info.webId)
  //     }
  // })
  const webId = req.query.webId;
  res.json(webId);
});

