// Copyright 2024 Patricia García Fernández.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

require('dotenv').config();
const express = require("express");
const cors = require("cors");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
const bp = require("body-parser");
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

// ============== APPLICATION CONFIGURATIONS ==========
const app = express();
const PORT = 8080;

// ============== APPLICATION MODULES ================
app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(bp.json()); // allows to send data to our express routes in a JSON format

app.use(cookieParser());

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

app.listen(PORT, () => console.log("Secure server started on port " + PORT));