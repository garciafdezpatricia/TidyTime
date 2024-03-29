require('dotenv').config();
const express = require("express");
const cors = require("cors");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
const bp = require("body-parser");
const uuidv4 = require("uuid").v4;
const moment = require('moment-timezone');
const { Session } = require("@inrupt/solid-client-authn-node");
const session = require('express-session');
const getUserEmail = require('./googleAuth/googleHelpers');
const {saveTokensToDB, emailExistsInDB, getTokensFromDB} = require('./dbconnection/db-connection');
const mongoose = require('mongoose');

// APPLICATION CONFIGURATIONS
const app = express();
const PORT = 8080;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(bp.json()); // allows send data to our express routes in a JSON format

// session
app.use(session({
  name: 'SessionCookie',
  genid: function (req) {
    return uuidv4(); // created session id
  },
  secret: 'thisismysecretlol!',
  resave: false,
  saveUninitialized: false, // if we dont change the session, cookies are not created
  cookie: {
    secure: false, //change to true to use https
    maxAge: 3600000 // one hour
  }
}))


const mongoUri = process.env.MONGO_URI;

mongoose.connect(mongoUri)
.then(console.log("Succesfully connected to MongoDB"));

app.listen(PORT, () => {
  console.log("Server started on port " + PORT);
});

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
      credentials: 'include',
  })
  .then((response) => response.json())
  .then((tokens) => {
    getUserEmail(tokens)
    .then(userEmail => {
      req.session.userEmail = userEmail; // save email in cookie
      emailExistsInDB(userEmail)
      .then(exists => {
        if (!exists){
          saveTokensToDB(userEmail, tokens)
          .then(response => {
            res.json({success: true, message: "Succesfully stored user authentication data"});
          })
          .catch(err => console.error("Error when saving tokens to the DB", err));
        } else {
          res.json({success: true, message: "Succesfully retrieved user authentication data from archives"})
        }

      })
      .catch(err => res.json({success: false, message: "Error on checking email"}));

    })
    .catch(error => {
      console.error("Error getting email from tokens: ", error);
    })

  })
  .catch((error) => {
    console.error("Token exchange error:", error);
  });

});

/**
 * Handler for getting resources from the google calendar API.
 */
app.get("/google/events", async function (req, res) {
  const tokens = await getTokensFromDB(req.session.userEmail);
  // need to pass the access_token in this way (?)
  fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events?access_token=' + tokens.access_token, {
      method: 'GET',
  })
  .then(response => response.json())
  .then(data => {
    const events = data.items.map(item => {
      const start = moment(item.start.dateTime).tz(item.start.timeZone);
      const end = moment(item.end.dateTime).tz(item.end.timeZone);

      return {
        start: start,
        end: end,
        title: item.summary,
        desc: item.description,
        eventId: uuidv4(),
        color: '#3E5B41'
      };
    });
    
    console.log(events);
    res.json(events);
  });
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

