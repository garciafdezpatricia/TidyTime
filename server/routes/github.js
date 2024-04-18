const express = require("express");
require('dotenv').config();

const router = express.Router();

router.get('/github/health-check', async (req, res) => {
  res.status(200).send('OK');
});

router.get('/github/auth', async (req, res) => {
    res.redirect("https://github.com/login/oauth/authorize?client_id=" 
    + process.env.GITHUB_CLIENT_ID)
});

router.get("/github/auth/callback", async function (req, res) {
    try {
      const params =
        "?client_id=" +
        process.env.GITHUB_CLIENT_ID +
        "&client_secret=" +
        process.env.GITHUB_CLIENT_SECRET +
        "&code=" +
        req.query.code;
      const response = await fetch("http://github.com/login/oauth/access_token" + params, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
      });
      const data = await response.json();
      if (data.access_token) {
        res.cookie('access_token', data.access_token, {
          secure: false,
          httpOnly: true
        })
        res.redirect(`http://localhost:3000/list?status=success`);
      } else {
        res.redirect(`http://localhost:3000/list?status=failure`)
      }
    } catch(error) {
        res.redirect(`http://localhost:3000/list?status=failure`)
    };
});

router.get("/github/logout", async function (req, res) {
  if (req.cookies.access_token) {
    res.clearCookie('access_token');
  }
  res.json({status: true, data: "Succesfully logged out!"});
});


router.get("/github/user/data", async function (req, res) {
  try {
    if (!req.cookies.access_token) {
      res.json({status: false, data: "Cookie access not found"});
      return;
    }
    const access_token = req.cookies.access_token;
    const response = await fetch("https://api.github.com/user", {
      method: "GET",
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
        Authorization: `Bearer ${access_token}`,
        Accept: "application/vnd.github+json",
      },
    });
    const userData = await response.json();
    res.json({status: true, data: userData});

  } catch (error) {
    res.json({status: false, data: "Error when fetching user data"});
  }
});

router.get("/github/issues/get", async function (req, res) {
  try {
    if (!req.cookies.access_token) {
      res.json({status: false, data: "Cookie access not found"});
    }
    const access_token = req.cookies.access_token;
    const response = await fetch(
      `https://api.github.com/search/issues?q=is:open+author:${req.query.user}+assignee:${req.query.user}`,
      {
        method: "GET",
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
          Authorization: `Bearer ${access_token}`,
          Accept: "application/vnd.github+json",
        },
      }
    );
    const data = await response.json();
    res.json({status: true, data: data});
  } catch (error) {
    res.json({status: false, data: "Error when fetching issues"});
  }
});

module.exports = router;