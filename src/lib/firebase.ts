import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: 'studio-643506016-613ca',
  appId: '1:978698189007:web:8868d1a1c0675ac0735fba',
  apiKey: 'AIzaSyDtgFoxI-0AmNMG-6_yXZVByhSw1DC1pmA',
  authDomain: 'studio-643506016-613ca.firebaseapp.com',
  storageBucket: 'studio-643506016-613ca.appspot.com',
  messagingSenderId: '978698189007',
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

export { app, auth, db, googleProvider };
