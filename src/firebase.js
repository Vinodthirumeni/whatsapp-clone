import firebase from "firebase";
const firebaseConfig = {
  apiKey: "AIzaSyDTE0IXGqaeOP1YxIu4RUpYEsl1oWJmAk4",
  authDomain: "whatsapp-clone-265ad.firebaseapp.com",
  databaseURL: "https://whatsapp-clone-265ad.firebaseio.com",
  projectId: "whatsapp-clone-265ad",
  storageBucket: "whatsapp-clone-265ad.appspot.com",
  messagingSenderId: "861240672423",
  appId: "1:861240672423:web:d2ee570a46c7dee4539b82",
  measurementId: "G-S2P88THZM3"
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const storage = firebase.storage();
export { auth, provider, storage};
export default db;


// If firebase expired
// https://console.firebase.google.com/u/0/project/whatsapp-clone-265ad/firestore/rules
