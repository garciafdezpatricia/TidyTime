const express = require("express");
const cors = require("cors");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const bp = require("body-parser");
const { Session } = require("@inrupt/solid-client-authn-node");
const { OAuth2Client } = require("google-auth-library");
require('dotenv').config();

const app = express();
const PORT = 8080;

app.use(cors()); // allows request to come from any origin
app.use(bp.json()); // allows send data to our express routes in a JSON format

// run application
app.listen(PORT, () => {
  console.log("Server started on port " + PORT);
});

// async cause fetch needs await
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
      // response back to our frontend
      res.json(data);
    });
});

app.get("/getUserData", async function (req, res) {
  req.get("Authorization"); // Bearear ACCESSTOKEN
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
  // use res.redirect
  res.redirect(
    "https://github.com/login/oauth/authorize?client_id=" + process.env.GITHUB_CLIENT_ID
  );
});

app.get("/getIssues", async function (req, res) {
  req.get("Authorization"); // Bearer ACCESSTOKEN
  // todo: will have to pass the username to list the issues of the authenticated user
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
      // Send the tokens back to the frontend, or store them securely and create a session
      res.json(tokens);
    })
    .catch((error) => {
      // Handle errors in the token exchange
      console.error("Token exchange error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    });
});
