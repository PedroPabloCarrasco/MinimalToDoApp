import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './data/screens/Home';
import AddTodo from './data/screens/AddTodo';

const Stack = createNativeStackNavigator();

const STORAGE_KEY = '@my_todos'; // clave para AsyncStorage

export default function App() {
  const [todos, setTodos] = useState([]);

  // Cargar tareas guardadas al iniciar la app
  useEffect(() => {
    const loadTodos = async () => {
      try {
        const storedTodos = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedTodos) setTodos(JSON.parse(storedTodos));
      } catch (error) {
        console.error('Error cargando tareas:', error);
      }
    };
    loadTodos();
  }, []);

  // Guardar tareas en AsyncStorage cada vez que cambian
  useEffect(() => {
    const saveTodos = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
      } catch (error) {
        console.error('Error guardando tareas:', error);
      }
    };
    saveTodos();
  }, [todos]);

  const addTodo = (newTodo) => {
    setTodos(currentTodos => [...currentTodos, newTodo]);
  };

  const updateTodos = (updatedTodos) => {
    setTodos(updatedTodos);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          options={{ headerShown: false }}
        >
          {props => (
            <Home
              {...props}
              todos={todos}
              onUpdate={updateTodos}
            />
          )}
        </Stack.Screen>
        <Stack.Screen
          name="AddTodo"
          options={{
            presentation: 'transparentModal',
            animation: 'slide_from_bottom',
            headerShown: false,
          }}
        >
          {props => (
            <AddTodo
              {...props}
              addTodo={addTodo}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
