import { initializeApp } from "firebase/app";
import {getFirestore} from '@firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyACVq7WgmCrAxg7mbcXkfvu6FzA2iK6qkk",
  authDomain: "hall-allocation-fb3ce.firebaseapp.com",
  projectId: "hall-allocation-fb3ce",
  storageBucket: "hall-allocation-fb3ce.appspot.com",
  messagingSenderId: "442082364221",
  appId: "1:442082364221:web:8e1ea67c323af2d3c5d354",
  measurementId: "G-5E57VK4PDV"
};

const app = initializeApp(firebaseConfig);

//connect to db firebase
export const db = getFirestore(app);