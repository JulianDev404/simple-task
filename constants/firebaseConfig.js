// Importa las funciones necesarias de los SDKs de Firebase
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyCm-x2LAa3XMfJCByiD1elCMB_kEb_PU9Y',
  authDomain: 'simple-task-6d527.firebaseapp.com',
  projectId: 'simple-task-6d527',
  storageBucket: 'simple-task-6d527.appspot.com', // Cambiado el dominio incorrecto
  messagingSenderId: '462854223731',
  appId: '1:462854223731:web:4aab0cbcbeaca76e737706',
  measurementId: 'G-4GDRECTBP8',
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Configura Firebase Auth con persistencia en AsyncStorage
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Configura Firestore
export const db = getFirestore(app);

// Inicializa Analytics (opcional, solo funciona en web o si configuras nativo)
const analytics = getAnalytics(app);
