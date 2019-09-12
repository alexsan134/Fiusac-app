const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    apiKey: "AIzaSyB1MPonpuvCFF9igWdr1-KTVV43i3I17e8",
    authDomain: "fiusac.firebaseapp.com",
    databaseURL: "https://fiusac.firebaseio.com",
    projectId: "fiusac",
    storageBucket: "fiusac.appspot.com",
    messagingSenderId: "980983277469",
    appId: "1:980983277469:web:980611419493b3cc",
    serviceAccountId: 'fiusac@appspot.gserviceaccount.com',
});

const db = admin.database();

exports.deleteUser = functions.auth.user().onDelete((user, context) => {
    db.ref("users/"+user.uid).remove();
    return 0;
})