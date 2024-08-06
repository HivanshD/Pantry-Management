import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyC1pkntmq-Z42eCI0IjV_eruOudVDodq7Q",
    authDomain: "inventory-management-sys-e5bcc.firebaseapp.com",
    projectId: "inventory-management-sys-e5bcc",
    storageBucket: "inventory-management-sys-e5bcc.appspot.com",
    messagingSenderId: "753390466434",
    appId: "1:753390466434:web:c167048f3c7ee0bd2ecb9b",
    measurementId: "G-YR5NDHEKTX"
 };
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export { firestore };