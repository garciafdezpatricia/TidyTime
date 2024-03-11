const mongoose = require('mongoose');

async function saveTokensToDB(userEmail, tokens) {
    const db = mongoose.connection.useDb("TidyTimeDev");
    const collection = db.collection("GoogleTokens");
    console.log(userEmail);
    const userTokens = {
        email: userEmail,
        tokens: tokens
    };

    return new Promise((resolve, reject) => {
        collection.insertOne(userTokens, function(err, res) {
            if (err) {
                throw err;
            } else {
                console.log("Tokens guardados en la base de datos");
                resolve(res);
            }
        })
    })
}

module.exports = saveTokensToDB;