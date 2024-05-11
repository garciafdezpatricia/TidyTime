const express = require("express");
require('dotenv').config();
const { addStringNoLocale, createThing, getSolidDataset, createContainerAt,  
    getThing, getStringNoLocale, getNamedNode, getAltProfileUrlAllFrom, 
    getPodUrlAll,  buildThing, createSolidDataset, setThing,
    saveSolidDatasetAt, getInteger, getStringNoLocaleAll, getBoolean, 
    getThingAll,
    removeAll,
    deleteSolidDataset} = require("@inrupt/solid-client")
const { Session, getSessionFromStorage } = require("@inrupt/solid-client-authn-node");
const { foaf, vcard, cal } = require('rdf-namespaces');
const { data } = require("rdf-namespaces/dist/fhir");


const router = express.Router();
let rootStorage = "";

// vocab
const CONFIG_OBJECT = "https://example.com/configuration";
const WEEK_START = "https://example.com/weekStart";
const CALENDAR_VIEW = "https://example.com/calendarView";
const SHOW_TASK = "https://example.com/showTask";
const BOARD_COLUMN = "https://example.com/boardColumns";
const LIST_NAME = "https://example.com/listNames";
// TODO: labels url
const LABEL_OBJECT = "https://example.com/label";
const LABEL_NAME = "https://example.com/name";
const LABEL_COLOR = "https://example.com/color";

// FUNCTIONS

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

/**
 * Create the root container if it doesn't already exist in the user's pod.
 * @param {*} session 
 * @returns true if it created the container, false otherwise.
 */
async function createRootContainer(session) {
    try {
        if (session) {
            const storage = await getPodUrlAll(session.info.webId, {fetch: session.fetch});
            rootStorage = `${storage}/TidyTime`;
            await createContainerAt(rootStorage, {fetch: session.fetch});
            return true;
        }
    } catch (error)  {
        return false;
    }
}

async function poblateRootContainer(session) {
    try {
        if (session) {
            const storage = await getPodUrlAll(session.info.webId, {fetch: session.fetch});
            const rootStorage = `${storage}/TidyTime`;

            let dataset = createSolidDataset();
            const configThing = buildThing(createThing({ name: "configuration" }))
            .addStringNoLocale(CALENDAR_VIEW, "month")
            .addStringNoLocale(BOARD_COLUMN, "To do")
            .addStringNoLocale(BOARD_COLUMN, "In progress")
            .addStringNoLocale(BOARD_COLUMN, "Done")
            .addBoolean(SHOW_TASK, true)
            .addInteger(WEEK_START, 1)
            .addUrl(CONFIG_OBJECT, CONFIG_OBJECT)
            .build();
            const label1 = buildThing(createThing({ name: "label1" }))
            .addStringNoLocale(LABEL_NAME, "home")
            .addStringNoLocale(LABEL_COLOR, "#ad30ad")
            .addUrl(LABEL_OBJECT, LABEL_OBJECT)
            .build();
            const label2 = buildThing(createThing({ name: "label2" }))
            .addStringNoLocale(LABEL_NAME, "school")
            .addStringNoLocale(LABEL_COLOR, "#5930ab")
            .addUrl(LABEL_OBJECT, LABEL_OBJECT)
            .build();
            const label3 = buildThing(createThing({ name: "label3" }))
            .addStringNoLocale(LABEL_NAME, "work")
            .addStringNoLocale(LABEL_COLOR, "#e6a937")
            .addUrl(LABEL_OBJECT, LABEL_OBJECT)
            .build();
            dataset = setThing(dataset, configThing);
            dataset = setThing(dataset, label1);
            dataset = setThing(dataset, label2);
            dataset = setThing(dataset, label3);
            const result = await saveSolidDatasetAt(`${rootStorage}/config`, dataset, {fetch: session.fetch});
        }
    } catch (error) {
        console.log(error);
    }
}

async function getApplicationConfiguration(session) {
    try {
        if (session) {
            const storage = await getPodUrlAll(session.info.webId, {fetch: session.fetch});
            const rootStorage = `${storage}/TidyTime`;

            const dataset = await getSolidDataset(`${rootStorage}/config`, {fetch: session.fetch});
            const things = getThingAll(dataset);
            const configThing = things.filter((thing) => thing.url.includes("#configuration"))[0];
            let result = {
                calendarView: getStringNoLocale(configThing, CALENDAR_VIEW),
                showTasksInCalendar: getBoolean(configThing, SHOW_TASK),
                weekStart: getInteger(configThing, WEEK_START),
                boardColumns: getStringNoLocaleAll(configThing, BOARD_COLUMN),
            }
            const labels = await Promise.all(things
            .filter((thing) => thing.url.includes("#label"))
            .map(async (thing) => {
                const name = getStringNoLocale(thing, LABEL_NAME);
                const color = getStringNoLocale(thing, LABEL_COLOR);
                return {
                    color: color,
                    name: name
                };
            }));
            return {...result, labels: labels};
        }
    } catch (error) {
        if (error.toString().includes("404")) {
            throw error;
        }
        console.log(error);
    }
}

async function storeConfiguration(session, labels, showTasksInCalendar, boardColumns, weekStart, calendarView ) {
    try {
        if (session) {
            const storage = await getPodUrlAll(session.info.webId, {fetch: session.fetch});
            const rootStorage = `${storage}/TidyTime`;

            await deleteSolidDataset(`${rootStorage}/config`, {fetch: session.fetch});
            let dataset = createSolidDataset();
            let configThing = buildThing(createThing({ name: "configuration" }))
            .addStringNoLocale(CALENDAR_VIEW, calendarView)
            .addBoolean(SHOW_TASK, showTasksInCalendar)
            .addInteger(WEEK_START, weekStart)
            .addUrl(CONFIG_OBJECT, CONFIG_OBJECT)
            .build();

            configThing = boardColumns.reduce((configThing, column) => {
                configThing = addStringNoLocale(configThing, BOARD_COLUMN, column);
                return configThing;
            }, configThing);
            let labelsThing = labels.map((label, index) => {
                return buildThing(createThing({ name: `label${index}` }))
                .addStringNoLocale(LABEL_NAME, label.name)
                .addStringNoLocale(LABEL_COLOR, label.color)
                .addUrl(LABEL_OBJECT, LABEL_OBJECT)
                .build();
            });
            dataset = setThing(dataset, configThing);
            dataset = labelsThing.reduce((dataset, labelThing) => {
                dataset = setThing(dataset, labelThing);
                return dataset;
            }, dataset)
            await saveSolidDatasetAt(`${rootStorage}/config`, dataset, {fetch: session.fetch});
            return true;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}

async function getApplicationData(session) {
    try {
        if (session) {
            const storage = await getPodUrlAll(session.info.webId, {fetch: session.fetch});
            const rootStorage = `${storage}/TidyTime`;

            const dataset = await getSolidDataset(`${rootStorage}/data`, {fetch: session.fetch});
            const things = getThingAll(dataset);
            const listNamesThing = things.filter((thing) => thing.url.includes("#listName"))[0];
            const listNames = getStringNoLocaleAll(listNamesThing, LIST_NAME);
            const tasks = [];
            
            // if (listNames.length > 0) {
            //     tasks = await Promise.all(things
            //     .filter((thing) => thing.url.includes("#task"))
            //     .map(async (thing) => {
            //         const name = getStringNoLocale(thing, LABEL_NAME);
            //         const color = getStringNoLocale(thing, LABEL_COLOR);
            //         return {
            //             color: color,
            //             name: name
            //         };
            //     }));
            // }
            // const events = await Promise.all(things
            //     .filter((thing) => thing.url.includes("#event"))
            //     .map(async (thing) => {
            //         const field = getStringNoLocale(thing, THING);
            //         return {
            //             field: field
            //         };
            //     })
            // )
            return { status: "success", data: {listNames: listNames, tasks: tasks} }//, tasks: tasks, events: events };
        }
    } catch (error) {
        console.log(error);
        if (error.status === '404') {
            return {status: "empty"};    
        }
        return {status: "fail"};
    }
}

async function storeListNames(session, listNames) {
    try {
        if (session) {
            const storage = await getPodUrlAll(session.info.webId, {fetch: session.fetch});
            const rootStorage = `${storage}/TidyTime`;

            let dataset = null;
            let listNameThing = null;
            try {
                dataset = await getSolidDataset(`${rootStorage}/data`, {fetch: session.fetch});
                // get current list names if any
                const things = getThingAll(dataset);
                listNameThing = things.filter((thing) => thing.url.includes("#listName"))[0];
                // remove all names
                listNameThing = removeAll(listNameThing, LIST_NAME);
            } catch (error) {
                dataset = createSolidDataset();
                // create new thing with current list names
                listNameThing = buildThing(createThing({ name: "listName" }))
                .addUrl(LIST_NAME, LIST_NAME)
                .build();           
            } finally {
                listNameThing = listNames.reduce((listNameThing, listName) => {
                    listNameThing = addStringNoLocale(listNameThing, LIST_NAME, listName);
                    return listNameThing;
                }, listNameThing);
                dataset = setThing(dataset, listNameThing);
                await saveSolidDatasetAt(`${rootStorage}/data`, dataset, {fetch: session.fetch});
                return true;
            }
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}

// ROUTES

router.get("/solid/login", async function (req, res) {
    try {
        const session = new Session();
        res.cookie("inruptSessionId", session.info.sessionId, {
            secure: true,
            httpOnly: true,
            sameSite: "none"
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
    } catch (error) {
        console.log(error);
    }
});

router.get("/solid/login/callback", async function (req, res) {
    try {
        const session = await getSessionFromStorage(req.cookies.inruptSessionId);
        await session.handleIncomingRedirect(`http://localhost:8080${req.url}`);

        if (session.info.isLoggedIn) {
            res.cookie("webId", session.info.webId, {
                secure: true,
                httpOnly: true,
                sameSite: "none"
            });
            res.redirect(`http://localhost:3000?user=${session.info.webId}`)
        }
    } catch (error) {
        console.log(error);
    }
})

router.get("/solid/user/session", async function (req, res) {
    try {
        const session = await getSessionFromStorage(req.cookies.inruptSessionId);
        if (session) {
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
    try {
        const session = await getSessionFromStorage(req.cookies.inruptSessionId);
        session.logout();
        res.send({status: true, data: "Succesfully logged out"});
    } catch (error) {
        console.log(error);
    }
});

router.get("/solid/container/root", async function (req, res) {
    try {
        const session = await getSessionFromStorage(req.cookies.inruptSessionId);
        const poblate = await createRootContainer(session);
        if (poblate) {
            await poblateRootContainer(session);
            res.send({status: "created"});
        } else {
            try {
                const configuration = await getApplicationConfiguration(session);
                res.send({status: "retrieved" , config: configuration});
            } catch (error) {
                await poblateRootContainer(session);
                res.send({status: "created"});
            }
        }
    } catch (error) {
        console.log(error);
    }
})

router.post("/solid/store/configuration", async function (req, res) {
    try {
        const session = await getSessionFromStorage(req.cookies.inruptSessionId);
        const labels = req.body.labels;
        const showTasksInCalendar = req.body.showTasksInCalendar;
        const boardColumns = req.body.boardColumns;
        const weekStart = req.body.weekStart;
        const calendarView = req.body.calendarView;
        const result = await storeConfiguration(session, labels, showTasksInCalendar, boardColumns, weekStart, calendarView);
        if (result) {
            res.send({status: "stored"});
        } else {
            res.send({status: false});
        }
    } catch (error) {
        console.log(error);
        res.send({status: false});
    }
});

router.post("/solid/data/store/listNames", async function (req, res) {
    try {
        const session = await getSessionFromStorage(req.cookies.inruptSessionId);
        const listNames = req.body.listNames;
        const result = await storeListNames(session, listNames);
        if (result) {
            res.send({status: true, data: listNames});
        } else {
            res.send({status: false, data: []});
        }
    } catch (error) {
        console.log(error);
        res.send({status: false, data: []});
    }
});

router.get("/solid/data/get", async function (req, res) {
    try {
        const session = await getSessionFromStorage(req.cookies.inruptSessionId);
        const result = await getApplicationData(session);
        if (result.status === "success") {
            res.send({status: "success", data: result});
        } else if (result.status === "empty") {
            res.send({status: "empty"});
        } else {
            res.send({status: "whatever"});
        }
    } catch (error) {
        console.log(error);
    }
})



module.exports = router;