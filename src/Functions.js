import firebase from "firebase/app";
import Dexie  from 'dexie';

// export default function showNotification(msg) {
//     navigator.serviceWorker.ready.then(function (registration) {
//         registration.periodicSync.register({
//             tag: 'show-notification',         // default: ''
//             minPeriod: 12 * 60 * 60 * 1000,
//             minInterval: 24 * 60 * 60 * 1000, // default: 0
//             powerState: 'avoid-draining',   // default: 'auto'
//             networkState: 'avoid-cellular'  // default: 'online'
//         }).then(function (periodicSyncReg) {
//             Notification.requestPermission(function (result) {
//                 if (result === 'granted') {
//                     periodicSyncReg.showNotification('Proximo curso', {
//                         body: msg,
//                         vibrate: [200, 100, 200, 100, 200, 100, 200],
//                         tag: 'event',
//                         icon: './img/icon.png'
//                     });
//                 }
//             });
//         }, function (err) {
//             console.log(err);
//         })
//     });
// }


//Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyB1MPonpuvCFF9igWdr1-KTVV43i3I17e8",
  authDomain: "fiusac.web.app",
  databaseURL: "https://fiusac.firebaseio.com",
  projectId: "fiusac",
  storageBucket: "fiusac.appspot.com",
  messagingSenderId: "980983277469",
  appId: "1:980983277469:web:980611419493b3cc"
};

firebase.initializeApp(firebaseConfig);
export { firebase };

//Courses DataBase
const db = new Dexie("coursesDB");
db.version(1).stores({
  courses: 'codeid, code, section'
})

export function dataHandler(data, type = 0) {
  if(type === 0) return db.courses.put(data);
  if(type === 1) return db.courses.delete(data.codeid);
  if(type === 2) return db.courses.toArray();
  if(type === 3) return db.courses.get(data.codeid,item => item);
}
