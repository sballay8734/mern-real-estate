// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
// import { getAnalytics } from "firebase/analytics"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "mern-real-estate-39b40.firebaseapp.com",
  projectId: "mern-real-estate-39b40",
  storageBucket: "mern-real-estate-39b40.appspot.com",
  messagingSenderId: "668571236330",
  appId: "1:668571236330:web:d776f907f4b3546e22a493",
  measurementId: "G-NP2VMRCTCX"
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
// const analytics = getAnalytics(app)
