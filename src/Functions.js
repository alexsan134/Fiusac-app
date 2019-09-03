import firebase from "firebase/app";
import "firebase/database";
import Dexie from 'dexie';

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
const firedb = firebase.database();
export { firebase , firedb};

//Init DataBase
let db;
export function initDB() {
  db = new Dexie("localDB");
  db.version(1).stores({
    courses: 'codeid, codigo, seccion',
    user: 'uid, name, email, photo, cover, providerId, metadata'
  })
  db.open().then(() => console.log("OpenDB")).catch(err => console.log("Error during open db ", err));
}

//DataBase requests
export function dataHandler(data, type = 0) {
  if (type === 0){
    db.courses.put(data);
    return db.courses.toArray();
  }
  if (type === 1) return db.courses.delete(data.codeid);
  if (type === 2) return db.courses.toArray();
  if (type === 3) return db.courses.get(data.codeid, item => item);
  if (type === 4 && data) {
    db.user.clear();
    return db.user.put(data).then(res => {
      return db.user.get(res, item => item);
    })
  }
  if( type === 5) {
    db.courses.clear();
    return db.courses.bulkAdd(data);
  }
  if(type === 6) db.courses.clear();
}

//Check user creation time
export function UserTime(user) {
  const creationTime = new Date(parseInt(user.metadata.a));
  const today = new Date();
  const diference = today - creationTime;

  if (diference < 1000 * 30) return "new";
  if (diference > 1000 * 3600 * 24) return "older";
}