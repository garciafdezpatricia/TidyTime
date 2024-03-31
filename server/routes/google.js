const express = require("express");
require('dotenv').config();
const moment = require('moment-timezone');
const uuidv4 = require("uuid").v4;
const { google } = require('googleapis');

const router = express.Router();
// ======= GOOGLE OAUTH CLIENT CONFIGURATION ===========

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_OAUTH_CLIENT_ID,
    process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    process.env.GOOGLE_OAUTH_REDIRECT_URI
  );
  
const scopes = [
'https://www.googleapis.com/auth/calendar',
'openid',
'https://www.googleapis.com/auth/userinfo.profile', 
'https://www.googleapis.com/auth/userinfo.email'
]

const authorizationUrl = oauth2Client.generateAuthUrl({
access_type: 'offline',
scope: scopes,
include_granted_scopes: true
});

// ==================== FUNCTIONS ===================

const getEmail = async () => {
    return new Promise((resolve, reject) => {
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
    const { tokens } = await oauth2Client.getToken(req.query.code);
    oauth2Client.setCredentials(tokens);
    console.log('Credenciales establecidas');
    const email = await getEmail();
    res.redirect(`http://localhost:3000/calendar?email=${email}`);
  });
  
router.get('/google/auth/url', (req, res) => {
    res.json({authorizationUrl});
})

/**
 * Handler for getting resources from the google calendar API.
 */
router.get("/google/events/get", async function (req, response) {
    const calendar = google.calendar({version: 'v3', auth: oauth2Client});
    calendar.events.list(
        {
            calendarId: 'primary',
        },
        (err, res) => {
            if (err) return console.error('Error al buscar eventos:', err);
            const retrievedEvents = res.data.items;
            if (retrievedEvents.length) {
                const events = retrievedEvents.map((event, i) => {
                const start = moment(event.start.dateTime).tz(event.start.timeZone).utc();
                const end = moment(event.end.dateTime).tz(event.end.timeZone).utc();
                return {
                    start: start,
                    end: end,
                    title: event.summary,
                    desc: event.description,
                    eventId: uuidv4(),
                    color: '#3E5B41',
                    googleId: event.id,
                    googleHTML: event.htmlLink,
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
    const calendar = google.calendar({version: 'v3', auth: oauth2Client});
    calendar.events.update({
        calendarId: 'primary',
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
            console.error('Error al actualizar el evento:', err);
            return;
        }
        console.log('Evento actualizado:', res.data);
    });
})

router.post('/google/events/insert', async function (req, response) {
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

module.exports = router;