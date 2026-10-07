import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyCEjgcWSJLNgJjFaeH4PUyicVhNEvXXdKI",
  authDomain: "viral-ytics-ai.firebaseapp.com",
  projectId: "viral-ytics-ai",
  storageBucket: "viral-ytics-ai.firebasestorage.app",
  messagingSenderId: "98423284170",
  appId: "1:98423284170:web:922541722ef4546c5daf33",
  measurementId: "G-KZ5Y0392T2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Safely initialize Firebase Analytics if supported in current browser environment
export const analyticsPromise = isSupported().then((supported) => {
  if (supported) {
    return getAnalytics(app);
  }
  return null;
});
