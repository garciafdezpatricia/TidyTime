const express = require("express");
const cors = require("cors");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const bp = require('body-parser')

const GITHUB_CLIENT_ID = "720509f4c43ea363e705";
const GITHUB_CLIENT_SECRET = "46e72f4046306b311c866f00473366c4e7253a6a";

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
    const params = "?client_id=" + GITHUB_CLIENT_ID + "&client_secret=" + GITHUB_CLIENT_SECRET + "&code=" + req.query.code;
    await fetch("http://github.com/login/oauth/access_token" + params, {
        method: "POST",
        headers: {
            "Accept": "application/json"
        }
    }).then((response) => {
        return response.json()
    }).then((data) => {
        // response back to our frontend
        res.json(data);
    });
});

app.get("/getUserData", async function (req, res) {
    req.get("Authorization"); // Bearear ACCESSTOKEN
    await fetch("https://api.github.com/user", {
        method: "GET",
        headers: {
            "Authorization" : req.get("Authorization") // Bearer ACCESSTOKEN
        }
    }).then((response) => {
        return response.json();
    }).then((data) => {
        res.json(data);
    })
});
