require('dotenv').config();
const express = require("express");
const cors = require("cors");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
const bp = require("body-parser");
const uuidv4 = require("uuid").v4;
const { Session } = require("@inrupt/solid-client-authn-node");
const session = require('express-session');
const connectDB = require('./db/mongo.db')


// APPLICATION CONFIGURATIONS
const app = express();
const PORT = 8080;

app.use(cors()); // allows request to come from any origin
app.use(bp.json()); // allows send data to our express routes in a JSON format
app.use(session({
  secret: 'thisismysecretlol!',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, //cambiar a true con https
    maxAge: 3600000 // una hora
  }
}))

// ######### ROUTES #########
// -> GOOGLE
/**
 * Handle google authentication using oauth2.0. 
 */
app.post("/api/auth/google", (req, res) => {
  const { code } = req.body;
  const grant_type = "authorization_code";
  const client_id = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const client_secret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  const redirect_uri = process.env.GOOGLE_OAUTH_REDIRECT_URI;
  
  fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      },

      body: new URLSearchParams({
          code,
          client_id,
          client_secret,
          redirect_uri,
          grant_type,
      }),
  })
  .then((response) => response.json())
  .then((tokens) => {
    // TODO: store them securely and create a session
    // access_token , expires_in, id_token, refresh_token, scope, token_type
    res.json(tokens);
  })
  .catch((error) => {
    // Handle errors in the token exchange
    console.error("Token exchange error:", error);
  });
});

/**
 * Handler for getting resources from the google calendar API.
 */
app.get("/google/calendar", async function (req, res) {
  console.log(req.get('Authorization'))
  // need to pass the access_token in this way (?)
  fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events?access_token=' + req.get('Authorization').split('Bearer ')[1], {
      method: 'GET',
  })
  .then(response => response.json())
  .then(data => {console.log(data); res.json(data)})
})

// -> GITHUB
/**
 * Handle GitHub Authentication using oauth2.0.
 */
app.get("/getAccessToken", async function (req, res) {
  // request contains the code given by GH to get the access token
  const params =
    "?client_id=" +
    process.env.GITHUB_CLIENT_ID +
    "&client_secret=" +
    process.env.GITHUB_CLIENT_SECRET +
    "&code=" +
    req.query.code;
  await fetch("http://github.com/login/oauth/access_token" + params, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      //TODO: store them securely
      // response back to the frontend
      res.json(data);
    });
});

/**
 * Handle for getting user data using GitHub API.
 */
app.get("/getUserData", async function (req, res) {
  await fetch("https://api.github.com/user", {
    method: "GET",
    headers: {
      Authorization: req.get("Authorization"), // Bearer ACCESSTOKEN
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      res.json(data);
    });
});

app.get("/authorizeGH", async function (req, res) {
  res.redirect(
    "https://github.com/login/oauth/authorize?client_id=" + process.env.GITHUB_CLIENT_ID
  );
});

app.get("/getIssues", async function (req, res) {
  req.get("Authorization"); // Bearer ACCESSTOKEN
  // TODO: will have to pass the username to list the issues of the authenticated user
  await fetch(
    "https://api.github.com/search/issues?q=author:garciafdezpatricia",
    {
      method: "GET",
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
        Authorization: req.get("Authorization"),
        Accept: "application/vnd.github+json",
      },
    }
  )
    .then((response) => {
      console.log(response);
      return response.json();
    })
    .then((data) => {
      console.log(data);
      res.json(data);
    });
});

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

