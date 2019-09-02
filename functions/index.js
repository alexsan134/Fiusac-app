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
    appId: "1:980983277469:web:980611419493b3cc"
});

const db = admin.database();

exports.setNewUser = functions.auth.user().onCreate((user, context) => {
    console.log(user);
    if (user.photoURL === null) {
        admin.auth().updateUser(user.uid, {
            photoURL: "https://firebasestorage.googleapis.com/v0/b/fiusac.appspot.com/o/default.jpg?alt=media&token=deb24fd8-e895-466a-91ba-513fdfdfef3c"
        }).then(() => console.log("Success"))
            .catch(err => console.log("Error", err));
    }
    else console.log("The user has already photo");
    return 0;
})

exports.deleteUser = functions.auth.user().onDelete((user, context) => {
    console.log('Deleting user: ' + user.email);
    db.ref("users/"+user.uid).remove();
    return 0;
})
