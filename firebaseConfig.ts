// firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: 'AIzaSyAPACiaEMD7hrzqWd8TN2p3wqLHPRZWRdI',
    authDomain: 'loginapp-48e64.firebaseapp.com',
    projectId: 'loginapp-48e64',
    storageBucket: 'loginapp-48e64.firebasestorage.app',
    messagingSenderId: '533507738075',
    appId: '1:533507738075:web:b719cf10657df302d43ffe',
    measurementId: 'G-JL9R1KS0T0'
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
