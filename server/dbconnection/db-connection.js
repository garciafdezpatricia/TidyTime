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

async function emailExistsInDB(userEmail) {
    const db = mongoose.connection.useDb("TidyTimeDev");
    const collection = db.collection("GoogleTokens");
  
    // check if email exists on db
    const userTokens = await collection.findOne({email: userEmail});
    return userTokens != null;
}

async function getTokensFromDB(userEmail) {
    const db = mongoose.connection.useDb("TidyTimeDev");
    const collection = db.collection("GoogleTokens");
  
    // check if email exists on db
    const user = await collection.findOne({email: userEmail});
    return user ? user.tokens : null;
}

module.exports = {saveTokensToDB, emailExistsInDB, getTokensFromDB};