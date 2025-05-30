import { configureStore } from "@reduxjs/toolkit";
import todoReducer from "./todosSlice"; // importa el reducer completo

export const store = configureStore({
  reducer: {
    todos: todoReducer, // aquí va el reducer completo, no una acción
  },
});
