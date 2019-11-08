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
export { firebase, firedb };

//Init DataBase
let db, feeds, phrases;
let feedControl = false;
export function initDB() {
  db = new Dexie("localDB");
  db.version(1).stores({
    courses: 'codeid, codigo, seccion',
    user: 'uid, name, email, photo, cover, providerId, carnet'
  })
  db.open().then(() => console.log("OpenDB")).catch(err => console.log("Error during open db ", err));

  feeds = new Dexie("feedsDB");
  feeds.version(1).stores({
    list: 'gettingTime, feedList'
  })
  feeds.open().then(() => {
    console.log("Open FeedsDB");
    getFeeds((data) => {
      feedControl = true;
    })
  })
    .catch(err => console.log("Error during open feedsDB ", err))

  phrases = new Dexie("phrases");
  phrases.version(1).stores({
    all:'key, list'
  })
  phrases.open().then(() =>{
    console.log("Open phrasesDB");
    firedb.ref("phrases").on('value', data =>{
      phrases.all.put({
        key:"first",
        list:data.val()
      }).then(() => console.log("Save phrases"));
    })
  })
  .catch(err => console.log("Error during open phrasesDB ", err))
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function changeTheme(c){
   document.body.style.cssText = `--primary:${c}`;

  let metaThemeColor = document.querySelector("meta[name=theme-color]");
      let style = getComputedStyle(document.body);                    let primary = style.getPropertyValue('--primary');                                                                              metaThemeColor.setAttribute("content",primary );
}

export async function getRandomPhrase(){
  return await phrases.all.toArray()
  .then(data => data[0].list[getRandomInt(0,data[0].list.length-1)]);
}

export function getFeeds(listener) {
  if (feedControl === false) {
    if (navigator.onLine) {
      firedb.ref("/feedsDB").once('value', data => {
        feeds.list.toArray()
          .then(listData => {
            if (listData.length > 0) {
              const backup = listData[0].feedList;
              const server = data.val().feedList;
              if (!isEqual(backup, server)) {
                feeds.list.clear();
                feeds.list.put({
                  gettingTime: new Date().getTime(),
                  feedList: data.val().feedList,
                  uploadTime: data.val().uploadTime
                }).then(() => listener(data.val()));
              }
              else {
                console.log("No updates on FeedsDB");
                listener(listData[0])
              }
            } else {
              feeds.list.put({
                gettingTime: new Date().getTime(),
                feedList: data.val().feedList,
                uploadTime: data.val().uploadTime
              }).then(() => listener(data.val()));
            }
          })
      })
    }
    else {
      feeds.list.toArray()
        .then(datalist => {
          if (datalist.length > 0) {
            listener(datalist[0])
          } else {
            console.log("Error no internet connection for read feeds.json");
            listener(false);
          }
        })
    }
  } else {
    feeds.list.toArray()
      .then(datalist => listener(datalist[0]))
  }
}

//DataBase requests
export function dataHandler(data, type = 0) {
  if (type === 0) {
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
  if (type === 5) {
    db.courses.clear();
    return db.courses.bulkAdd(data);
  }
  if (type === 6) db.courses.clear();
  if (type === 7) return db.user.toArray();
  if (type === 8) db.user.clear();
}

//Check user creation time
export function UserTime(user) {
  const creationTime = new Date(parseInt(user.metadata.a));
  const today = new Date();
  const diference = today - creationTime;

  if (diference < 1000 * 30) return "new";
  if (diference > 1000 * 3600 * 24) return "older";
}

//Helper
function isEqual(value, other) {
  let type = Object.prototype.toString.call(value);
  if (type !== Object.prototype.toString.call(other)) return false;
  if (['[object Array]', '[object Object]'].indexOf(type) < 0) return false;

  let valueLen = type === '[object Array]' ? value.length : Object.keys(value).length;
  let otherLen = type === '[object Array]' ? other.length : Object.keys(other).length;
  if (valueLen !== otherLen) return false;

  const compare = function (item1, item2) {
    let itemType = Object.prototype.toString.call(item1);

    if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
      if (!isEqual(item1, item2)) return false;
    } else {
      if (itemType !== Object.prototype.toString.call(item2)) return false;
      if (itemType === '[object Function]') {
        if (item1.toString() !== item2.toString()) return false;
      } else {
        if (item1 !== item2) return false;
      }
    }
  };
  if (type === '[object Array]') {
    for (let i = 0; i < valueLen; i++) {
      if (compare(value[i], other[i]) === false) return false;
    }
  } else {
    for (let key in value) {
      if (value.hasOwnProperty(key)) {
        if (compare(value[key], other[key]) === false) return false;
      }
    }
  }

  return true;
};
