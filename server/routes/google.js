// Copyright 2024 Patricia García Fernández.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
                    resolve(email);
                }
            });
    });
};

// ===================== ROUTES =====================

/**
 * Callback for the authentication.
 */
router.get('/google/auth/callback', async (req, res) => {
    const userId = req.query.state;
    const oauth2Client = userClients[userId];

    const { tokens } = await oauth2Client.getToken(req.query.code);
    oauth2Client.setCredentials(tokens);
    try {
        const email = await getEmail(req);
        res.redirect(`${process.env.FRONT_URL}/calendar?user=${email}`);
    } catch (error) {
        res.redirect(`${process.env.FRONT_URL}/calendar`);
    }
});
  
/**
 * Generates the authentication url to which the user must be redirected.
 */
router.get('/google/auth/url', (req, res) => {
    const userId = getUserId(req);
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
    try {
        const userId = getUserId(req);
        const oauth2Client = userClients[userId];
        oauth2Client.setCredentials(null);
        res.json({status: 'success'});
    } catch (error) {
        console.log(error);
    }
})

/**
 * Checks if the email of the authenticated user is the same as the one received.
 */
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
    // to avoid saturating the pod, just import two month away events
    const now = new Date(); // current date
    const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1); // first day of last month
    const lastDayNextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0); // last day next month
    const { calendarId } = req.body;
    const calendar = google.calendar({version: 'v3', auth: oauth2Client});
    calendar.events.list(
        {
            calendarId: calendarId,
            timeMin: firstDayLastMonth.toISOString(),
            timeMax: lastDayNextMonth.toISOString()
        },
        (err, res) => {
            if (err) return console.error('Error al buscar eventos:', err);
            const retrievedEvents = res.data.items;
            if (retrievedEvents.length) {
                const events = retrievedEvents.map((event, i) => {
                    let start, end;
                    console.log("el evento", event);
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

/**
 * Update an event in Google.
 */
router.post('/google/events/update', async function(req, response) {
    const userId = getUserId(req); 
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

/**
 * Insert a new event in the primary Google calendar of the user.
 */
router.post('/google/events/insert', async function (req, response) {
    const userId = getUserId(req); 
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

/**
 * Retrieve the list of calendars of the user.
 */
router.get('/google/calendar/list', async function (req, res) {
    const userId = getUserId(req); 
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