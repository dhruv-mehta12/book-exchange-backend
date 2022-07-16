const serviceAccountConfig = require('./config.json');

const admin = require('firebase-admin')
admin.initializeApp({
    credential: admin.credential.cert(serviceAccountConfig)
});

const firestore = admin.firestore()
module.exports = firestore;

