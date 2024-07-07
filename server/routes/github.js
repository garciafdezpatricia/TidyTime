const express = require("express");
const crypto = require("crypto");
require('dotenv').config();

const router = express.Router();


// ======================= ENCRYPTION =========================
const algorithm = process.env.CRYPTO_ALGORITHM;
const secretKey = process.env.CRYPTO_SECRET_KEY;
const iv = crypto.randomBytes(16);


const encrypt = (text) => {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

const decrypt = (hash) => {
  let [iv, encrypted] = hash.split(':');
  iv = Buffer.from(iv, 'hex');
  encrypted = Buffer.from(encrypted, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString();
}

// ======================= ROUTES ==========================
/**
 * Redirects the user to the GitHub authorization
 */
router.get('/github/auth', async (req, res) => {
    res.redirect("https://github.com/login/oauth/authorize?client_id=" 
    + process.env.GITHUB_CLIENT_ID + "&scope=repo")
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
        const encryptedToken = encrypt(data.access_token);
        res.cookie('access_token', encryptedToken, {
          secure: true,
          httpOnly: true,
          sameSite: "none"
        })
        res.redirect(`${process.env.FRONT_URL}/list?status=success`);
      } else {
        res.redirect(`${process.env.FRONT_URL}/list?status=failure`)
      }
    } catch(error) {
        console.log(error);
        res.redirect(`${process.env.FRONT_URL}/list?status=failure`)
    };
});

router.get("/github/logout", async function (req, res) {
  try {
    if (req.cookies.access_token) {
      res.clearCookie('access_token');
    }
    res.json({status: true, data: "Succesfully logged out!"});
  } catch (error) {
    console.log(error);
  }
});

/**
 * Retreieves the authenticated user data.
 */
router.get("/github/user/data", async function (req, res) {
  try {
    if (!req.cookies.access_token) {
      res.json({status: false, data: "Cookie access not found"});
      return;
    }
    const access_token = decrypt(req.cookies.access_token);
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
    console.log(error);
    res.json({status: false, data: "Error when fetching user data"});
  }
});

/**
 * Retrieves all the open issues assigned to the authenticated user.
 */
router.get("/github/issues/get", async function (req, res) {
  try {
    if (!req.cookies.access_token) {
      res.json({status: false, data: "Cookie access not found"});
    }
    const access_token = decrypt(req.cookies.access_token);
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
    console.log(error);
    res.json({status: false, data: "Error when fetching issues"});
  }
});

/**
 * Close an existing issue in GitHub
 */
router.post("/github/issues/close", async function (req, res) {
  try {
    if (!req.cookies.access_token) {
      res.json({status: false, data: "Cookie access not found"});
    }
    const access_token = decrypt(req.cookies.access_token);
    const response = await fetch(`${req.body.url}`,
      {
        method: "PATCH",
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
          Authorization: `Bearer ${access_token}`,
          Accept: "application/vnd.github+json",
        },
        body: JSON.stringify({state: "closed"})
      }
    );
    const data = await response.json();
    res.json({status: true, data: data});
  } catch (error) {
    console.log(error);
    res.json({status: false, data: "Error when updating the issue"});
  }
});

/**
 * Open an existing issue in GitHub
 */
router.post("/github/issues/open", async function (req, res) {
  try {
    if (!req.cookies.access_token) {
      res.json({status: false, data: "Cookie access not found"});
    }
    const access_token = decrypt(req.cookies.access_token);
    const response = await fetch(`${req.body.url}`,
      {
        method: "PATCH",
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
          Authorization: `Bearer ${access_token}`,
          Accept: "application/vnd.github+json",
        },
        body: JSON.stringify({state: "open"})
      }
    );
    const data = await response.json();
    res.json({status: true, data: data});
  } catch (error) {
    console.log(error);
    res.json({status: false, data: "Error when updating the issue"});
  }
});

/**
 * Update an existing issue in GitHub
 */
router.post("/github/issues/update", async function (req, res) {
  try {
    if (!req.cookies.access_token) {
      res.json({status: false, data: "Cookie access not found"});
    }
    const access_token = decrypt(req.cookies.access_token);
    const response = await fetch(
      `${req.body.url}`,
      {
        method: "PATCH",
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
          Authorization: `Bearer ${access_token}`,
          Accept: "application/vnd.github+json",
        },
        body: JSON.stringify({
          title: req.body.title,
          body: req.body.desc
        })
      }
    );
    const data = await response.json();
    res.json({status: true, data: data});
  } catch (error) {
    console.log(error);
    res.json({status: false, data: "Error when updating the issue"});
  }
});

module.exports = router;