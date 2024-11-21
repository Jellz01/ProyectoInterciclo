
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { Firestore } from "@angular/fire/firestore";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCitQSJx5LFy_CWsmmAq3Mxfu9ruDBm2p4",
  authDomain: "jfintegrador.firebaseapp.com",
  projectId: "jfintegrador",
  storageBucket: "jfintegrador.firebasestorage.app",
  messagingSenderId: "138144514455",
  appId: "1:138144514455:web:7f1ea9ff48e5c37f6b04d2",
  measurementId: "G-EXENJJQW81"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const firestore = getFirestore(app); 
const db = getFirestore(app);

export { auth, analytics,firestore,db };