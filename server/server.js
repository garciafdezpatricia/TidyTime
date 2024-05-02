require('dotenv').config();
const express = require("express");
const cors = require("cors");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
const bp = require("body-parser");
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

// ============== APPLICATION CONFIGURATIONS ==========
const app = express();
const PORT = 4000;
const mongoUri = process.env.MONGO_URI;

// ============== APPLICATION MODULES ================
app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(bp.json()); // allows to send data to our express routes in a JSON format

app.use(cookieParser());

// mongoose.connect(mongoUri)
// .then(console.log("Succesfully connected to MongoDB"));

app.listen(PORT, () => {
  console.log("Server started on port " + PORT);
});

app.get('/health-check', async (req, res) => {
  res.status(200).send('OK');
});

const googleRouter = require('./routes/google');
const githubRouter = require('./routes/github');
const solidRouter = require('./routes/inrupt');

// ######### ROUTES #########
// -> GOOGLE
app.use(googleRouter);

// -> GITHUB
app.use(githubRouter);

// INRUPT ->
app.use(solidRouter);

