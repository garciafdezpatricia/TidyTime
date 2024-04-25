const mongoose = require('mongoose');

async function saveToDB(user, data, collection) {
    const db = mongoose.connection.useDb("TidyTimeDev");
    const collection = db.collection(collection);
    const userTokens = {
        user: user,
        data: data
    };

    return new Promise((resolve, reject) => {
        collection.insertOne(userTokens, function(err, res) {
            if (err) {
                throw err;
            } else {
                console.log("Saved in DB");
                resolve(res);
            }
        })
    })
}

async function userInDB(user, collection) {
    const db = mongoose.connection.useDb("TidyTimeDev");
    const collection = db.collection(collection);
  
    const userTokens = await collection.findOne({user: user});
    return userTokens;
}

async function getUserDataFromDB(user, collection) {
    const db = mongoose.connection.useDb("TidyTimeDev");
    const collection = db.collection(collection);
  
    // check if email exists on db
    const user = await collection.findOne({user: user});
    return user ? user.data : null;
}

module.exports = {saveToDB, userInDB, getUserDataFromDB};