const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

async function getUserEmail(tokens) {
    return fetch("https://www.googleapis.com/oauth2/v2/userinfo?access_token=" + tokens.access_token, {
        method: "GET",
        Authorization: "Bearer " + tokens.access_token,
    })
    .then(response => response.json())
    .then((profileInfo) => {
        return profileInfo.email;
    })
    .catch(error => console.error(error));
}

module.exports = getUserEmail;