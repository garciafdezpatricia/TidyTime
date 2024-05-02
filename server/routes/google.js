const express = require("express");
require('dotenv').config();
const moment = require('moment-timezone');
const uuidv4 = require("uuid").v4;
const { google } = require('googleapis');

const router = express.Router();
const userClients = {};
// ======= GOOGLE OAUTH CLIENT CONFIGURATION ===========
  
const scopes = [
'https://www.googleapis.com/auth/calendar',
'openid',
'https://www.googleapis.com/auth/userinfo.profile', 
'https://www.googleapis.com/auth/userinfo.email'
]

// ==================== FUNCTIONS ===================

const getUserId = (req) => {
    if (!req.cookies.webId) {
        return null;
    }
    return req.cookies.webId;
}

const getEmail = async (req) => {
    return new Promise((resolve, reject) => {
        const userId = getUserId(req);
        const oauth2Client = userClients[userId];
        const people = google.people({ version: 'v1', auth: oauth2Client });
        people.people.get({
                resourceName: 'people/me',
                personFields: 'emailAddresses'
            }, (err, res) => {
                if (err) {
                    console.error('Error al obtener el email del usuario:', err);
                    reject(err);
                } else {
                    const email = res.data.emailAddresses[0].value;
                    console.log('Email del usuario:', email);
                    resolve(email);
                }
            });
    });
};

// ===================== ROUTES =====================

router.get('/google/auth/callback', async (req, res) => {
    const userId = req.query.state;
    const oauth2Client = userClients[userId];

    const { tokens } = await oauth2Client.getToken(req.query.code);
    console.log(tokens);
    oauth2Client.setCredentials(tokens);
    try {
        const email = await getEmail(req);
        res.redirect(`http://16.170.157.60:3000/calendar?user=${email}`);
    } catch (error) {
        res.redirect('http://16.170.157.60:3000/calendar');
    }
});
  
router.get('/google/auth/url', (req, res) => {
    const userId = getUserId(req);
    console.log("getUserId no es");
    let oauth2Client = userClients[userId];
    
    if (!oauth2Client) {
        oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_OAUTH_CLIENT_ID,
            process.env.GOOGLE_OAUTH_CLIENT_SECRET,
            process.env.GOOGLE_OAUTH_REDIRECT_URI
        );
        userClients[userId] = oauth2Client;
    }

    const authorizationUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        state: userId,
        include_granted_scopes: true
    });
    res.json({authorizationUrl});
})

router.get('/google/auth/logout', (req, res) => {
    const userId = getUserId(req);
    const oauth2Client = userClients[userId];
    oauth2Client.setCredentials(null);
    res.json({status: 'success'});
})

router.post('/google/auth/email', async (req, res) => {
    const emailToCheck = req.body.email;
    try {
        const email = await getEmail(req);
        res.json(email === emailToCheck);
    } catch (error) {
        return res.json(false);
    }
})

/**
 * Handler for getting resources from the google calendar API.
 */
router.post("/google/events/get", async function (req, response) {
    const userId = getUserId(req); // Implement this function
    const oauth2Client = userClients[userId];
    
    const { calendarId } = req.body;
    const calendar = google.calendar({version: 'v3', auth: oauth2Client});
    calendar.events.list(
        {
            calendarId: calendarId,
        },
        (err, res) => {
            if (err) return console.error('Error al buscar eventos:', err);
            const retrievedEvents = res.data.items;
            if (retrievedEvents.length) {
                const events = retrievedEvents.map((event, i) => {
                    let start, end;
                    // all day events only have the property date. Otherwise, they include date time and time zone
                    if (event.start.dateTime && event.end.dateTime) {
                        start = moment(event.start.dateTime).tz(event.start.timeZone).utc();
                        end = moment(event.end.dateTime).tz(event.end.timeZone).utc();
                    } else {
                        start = moment(event.start.date).utc().add(1, 'day').startOf('day');
                        end = moment(event.end.date).utc().endOf('day');
                    }
                return {
                    start: start,
                    end: end,
                    title: event.summary,
                    desc: event.description,
                    eventId: uuidv4(),
                    color: '#3E5B41',
                    googleId: event.id,
                    googleHTML: event.htmlLink,
                    googleCalendar: calendarId,
                };
                });
                response.json(events);
            } else {
                console.log('No hay eventos');
            }
        }
    );
});

router.post('/google/events/update', async function(req, response) {
    const userId = getUserId(req); // Implement this function
    const oauth2Client = userClients[userId];

    const calendar = google.calendar({version: 'v3', auth: oauth2Client});
    calendar.events.update({
        calendarId: req.body.calendarId,
        eventId: req.body.id,
        requestBody: {
            summary: req.body.title,
            description: req.body.desc,
            start: {dateTime: req.body.start},
            end: {dateTime: req.body.end}
        }
    },
    (err, res) => {
        if (err) {
            response.json({status: 'error', value: err.response.data.error.message});
            return;
        }
        response.json({status: 'success', value: res.data});
    });
})

router.post('/google/events/insert', async function (req, response) {
    const userId = getUserId(req); // Implement this function
    const oauth2Client = userClients[userId];

    const calendar = google.calendar({version: 'v3', auth: oauth2Client});
    calendar.events.insert({
        calendarId: 'primary',
        requestBody: {
            summary: req.body.title,
            description: req.body.desc,
            start: {dateTime: req.body.start},
            end: {dateTime: req.body.end}
        }
    },
    (err, res) => {
        if (err) {
            console.log(err);
            return;
        }
        const event = res.data;
        response.json({
            googleId: event.id,
            googleHTML: event.htmlLink,
        });
    });
});

router.get('/google/calendar/list', async function (req, res) {
    const userId = getUserId(req); // Implement this function
    const oauth2Client = userClients[userId];

    const calendar = google.calendar({version: 'v3', auth: oauth2Client});
    try {
        const response = await calendar.calendarList.list();
        const items = response.data.items;
        res.json({status: 'success', value: items});
    } catch (error) {
        res.json({status: 'error', value: error.message});
    }

})

module.exports = router;