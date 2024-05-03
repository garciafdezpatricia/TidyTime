const express = require("express");
require('dotenv').config();
const { getProfileAll, getSourceUrl, getSolidDataset, getThing, getStringNoLocale, getNamedNode, getAltProfileUrlAllFrom } = require("@inrupt/solid-client")
const { Session, getSessionFromStorage } = require("@inrupt/solid-client-authn-node");
const { foaf, vcard } = require('rdf-namespaces');


const router = express.Router();


async function getNameFromWebId(webId, dataset) {
    const webIdThing = await getThing(dataset, webId);
    const namePredicates = [foaf.name, vcard.fn]; 
    const userName = namePredicates.reduce((acc, predicate) =>
        acc ??
        getStringNoLocale(webIdThing, predicate) ??
        getNamedNode(webIdThing, predicate)?.value ??
        null
    , null);
    return userName;
}

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
        redirectUrl: "https://tidytime.onrender.com/solid/login/callback",
        oidcIssuer: "https://login.inrupt.com",
        clientName: "TidyTimeDev",
        handleRedirect: redirectToIDP
    });
});

router.get("/solid/login/callback", async function (req, res) {
    const session = await getSessionFromStorage(req.cookies.inruptSessionId);
    await session.handleIncomingRedirect(`https://tidytime.onrender.com${req.url}`);

    if (session.info.isLoggedIn) {
        res.cookie("webId", session.info.webId, {
            secure: false,
            httpOnly: true
        });
        res.redirect(`https://garciafdezpatricia.github.io/TidyTime?user=${session.info.webId}`)
    }
})

router.get("/solid/user/session", async function (req, res) {
    try {
        const session = await getSessionFromStorage(req.cookies.inruptSessionId);
        if (session) {
            console.log(new Date(new Date().getTime() + session.info.expirationDate).toLocaleString())
            res.send({status: true, session: session});
        } else {
            res.send({status: false});
        }
    } catch (error) {
        console.log(error);
    }
});

router.get("/solid/user/profile", async function (req, res) {
    try {
        const session = await getSessionFromStorage(req.cookies.inruptSessionId);
        if (session) {
            const webId = session.info.webId;
            const dataset = await getSolidDataset(webId, {fetch: fetch});
            let result = await getNameFromWebId(webId, dataset);
            // if result is null, that means the webId dataset does not have the any name predicate.
            // in that case, we navigate through all the predicates to check if the name is in any of them.
            if (!result) {
                result = await Promise.any(getAltProfileUrlAllFrom(webId, dataset).map(
                    async (uniqueProfileIri) => {
                        const dummyDataset = await getSolidDataset(uniqueProfileIri, {fetch: session.fetch});
                        const altName = getNameFromWebId(webId, dummyDataset);
                        return altName;
                    }
                ));
            } 
            res.send({status: true, data: result});
        }
    } catch (error) {
        res.send({status: false, data: `${error}`});
    }
});

router.get("/solid/logout", async function (req, res) {
    const session = await getSessionFromStorage(req.cookies.inruptSessionId);
    session.logout();
    res.send({status: true, data: "Succesfully logged out"});
});






module.exports = router;