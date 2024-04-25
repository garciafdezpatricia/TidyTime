const express = require("express");
require('dotenv').config();
const { Session, getSessionFromStorage } = require("@inrupt/solid-client-authn-node");


const router = express.Router();


router.get("/solid/login", async function (req, res) {
    const session = new Session();
    res.cookie("inruptSessionId", session.info.sessionId, {
        secure: false,
        httpOnly: true
    });

    const redirectToIDP = (url) => {
        res.redirect(url);
    }

    await session.login({
        redirectUrl: "http://localhost:8080/solid/login/callback",
        oidcIssuer: "https://login.inrupt.com",
        clientName: "TidyTimeDev",
        handleRedirect: redirectToIDP
    });
});

router.get("/solid/login/callback", async function (req, res) {
    const session = await getSessionFromStorage(req.cookies.inruptSessionId);
    await session.handleIncomingRedirect(`http://localhost:8080${req.url}`);

    if (session.info.isLoggedIn) {
        res.cookie("webId", session.info.webId, {
            secure: false,
            httpOnly: true
        });
        res.redirect(`http://localhost:3000?user=${session.info.webId}`)
    }
})

router.get("/solid/user/session", async function (req, res) {
    const session = await getSessionFromStorage(req.cookies.inruptSessionId);
    if (session) {
        res.send({session: session});
    }
});

router.get("/solid/logout", async function (req, res) {
    const session = await getSessionFromStorage(req.cookies.inruptSessionId);
    session.logout();
    res.send({status: true, data: "Succesfully logged out"});
});






module.exports = router;