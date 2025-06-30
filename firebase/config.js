// Importa desde React Native Firebase
import { initializeApp } from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import analytics from '@react-native-firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCF5e8LtfYDsoZXAif-GMcCQrJL0X9ZE5U",
  authDomain: "todoapp-f13ae.firebaseapp.com",
  projectId: "todoapp-f13ae",
  storageBucket: "todoapp-f13ae.appspot.com", // Cambiado a .appspot.com
  messagingSenderId: "235359965067",
  appId: "1:235359965067:web:66f112ed491c9a1500a98e",
  measurementId: "G-RR3BW44CER"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta los servicios que necesitarás
export { firestore, analytics };