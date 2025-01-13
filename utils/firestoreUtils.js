import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../constants/firebaseConfig'; // Ajusta la ruta si es necesario

const fetchUserInfo = async (uid) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Usuario no autenticado');

    const docRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log('Datos del usuario:', docSnap.data());
      return docSnap.data();
    } else {
      console.log('No se encontró información del usuario');
    }
  } catch (error) {
    console.error('Error al obtener datos del usuario:', error.message);
  }
};

export { fetchUserInfo };
