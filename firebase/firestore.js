// src/firebase/firestore.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, onSnapshot } from "firebase/firestore";
import firebaseConfig from "./config";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Operaciones específicas para tareas colaborativas
export const sharedTodosService = {
  // Escuchar cambios en tiempo real
  subscribeToSharedTodos: (panelId, callback) => {
    const panelRef = doc(db, "sharedPanels", panelId);
    return onSnapshot(panelRef, (doc) => {
      if (doc.exists()) callback(doc.data().todos || []);
    });
  },

  // Agregar tarea compartida
  addSharedTodo: async (panelId, newTodo) => {
    const panelRef = doc(db, "sharedPanels", panelId);
    const currentData = (await getDoc(panelRef)).data();
    await updateDoc(panelRef, {
      todos: [...currentData.todos, newTodo]
    });
  }
};