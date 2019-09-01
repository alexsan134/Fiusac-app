const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.applicationDefault()
});

const db = admin.firestore();
const users_coll = db.collection('users');

exports.setNewUser = functions.auth.user().onCreate((user, context) => {
    console.log(user);
    if (user.photoURL === null) {
        admin.auth().updateUser(user.uid, {
            photoURL: "https://firebasestorage.googleapis.com/v0/b/fiusac.appspot.com/o/default.jpg?alt=media&token=deb24fd8-e895-466a-91ba-513fdfdfef3c"
        }).then(() => console.log("Success"))
            .catch(err => console.log("Error", err));
    }
    else console.log("The user has already photo");
    const newDoc = users_coll.doc(user.uid);
    newDoc.set({
        uid: user.uid,
        name: user.displayName,
        email: user.email
    });
    return 0;
})

exports.deleteUser = functions.auth.user().onDelete((user, context) => {
    console.log('Deleting user: ' + user.email);
    users_coll.doc(user.uid).delete();
    return 0;
})