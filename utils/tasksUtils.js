import {
  addDoc,
  collection,
  doc,
  getDocs,
  deleteDoc,
  updateDoc,
  query,
  where,
} from 'firebase/firestore';
import { db, auth } from '../constants/firebaseConfig';

const addTaskToFirestore = async (task) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Usuario no autenticado');
    console.log('Usuario autenticado:', user.uid);
    const docRef = await addDoc(collection(db, 'tasks'), {
      ...task,
      uid: user.uid, // Incluye el uid del usuario autenticado
    });
    console.log('Tarea añadida con ID:', docRef.id);
  } catch (error) {
    console.error('Error al agregar tarea:', error.message);
  }
};

const getTasksFromFirestore = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Usuario no autenticado');

    const tasksQuery = query(
      collection(db, 'tasks'),
      where('uid', '==', user.uid)
    );
    const querySnapshot = await getDocs(tasksQuery);
    const tasks = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return tasks;
  } catch (error) {
    console.error('Error al obtener tareas:', error.message);
    throw error;
  }
};

const updateTaskInFirestore = async (id, updatedTask) => {
  try {
    const taskRef = doc(db, 'tasks', id);
    await updateDoc(taskRef, updatedTask);
    console.log('Tarea actualizada');
  } catch (error) {
    console.error('Error al actualizar tarea:', error.message);
  }
};

const deleteTaskFromFirestore = async (id) => {
  try {
    const taskRef = doc(db, 'tasks', id);
    await deleteDoc(taskRef);
    console.log('Tarea eliminada');
  } catch (error) {
    console.error('Error al eliminar tarea:', error.message);
  }
};

export {
  addTaskToFirestore,
  getTasksFromFirestore,
  updateTaskInFirestore,
  deleteTaskFromFirestore,
};
