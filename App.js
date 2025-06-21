// Archivo: App.js
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Notifications from 'expo-notifications';

import Home from './data/screens/Home';
import AddTodo from './data/screens/AddTodo';

const Stack = createNativeStackNavigator();

export default function App() {
  const [todos, setTodos] = useState([]);
  const [points, setPoints] = useState(0);
  const [achievements, setAchievements] = useState([]);

  // Pedir permisos para notificaciones
  useEffect(() => {
    const getPermissions = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        await Notifications.requestPermissionsAsync();
      }
    };
    getPermissions();
  }, []);

  // Cargar datos desde AsyncStorage
  useEffect(() => {
    const loadData = async () => {
      try {
        const todosData = await AsyncStorage.getItem('@todos');
        const pointsData = await AsyncStorage.getItem('@points');
        const achData = await AsyncStorage.getItem('@achievements');

        if (todosData) setTodos(JSON.parse(todosData));
        if (pointsData) setPoints(parseInt(pointsData, 10));
        if (achData) setAchievements(JSON.parse(achData));
      } catch (error) {
        console.log('Error cargando datos:', error);
      }
    };
    loadData();
  }, []);

  // Guardar datos en AsyncStorage
  useEffect(() => {
    AsyncStorage.setItem('@todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    AsyncStorage.setItem('@points', points.toString());
  }, [points]);

  useEffect(() => {
    AsyncStorage.setItem('@achievements', JSON.stringify(achievements));
  }, [achievements]);

  // Agregar nueva tarea
  const addTodo = (newTodo) => {
    setTodos((prevTodos) => {
      const updatedTodos = [...prevTodos, newTodo];
      AsyncStorage.setItem('@todos', JSON.stringify(updatedTodos));
      return updatedTodos;
    });
  };

  // Actualizar lista de tareas (marcar completadas, etc.)
  const updateTodos = (updatedTodos) => {
    setTodos(updatedTodos);
    const completedCount = updatedTodos.filter((t) => t.isCompleted).length;
    setPoints(completedCount * 10);

    if (completedCount >= 5 && !achievements.includes('5tasks')) {
      setAchievements((prev) => [...prev, '5tasks']);
      alert('🎉 ¡Logro desbloqueado: Completaste 5 tareas!');
    }
    if (completedCount >= 10 && !achievements.includes('10tasks')) {
      setAchievements((prev) => [...prev, '10tasks']);
      alert('🏆 ¡Logro desbloqueado: Completaste 10 tareas!');
    }
  };

  // Eliminar tarea
  const deleteTodo = (id) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home">
          {(props) => (
            <Home
              {...props}
              todos={todos}
              onUpdate={updateTodos}
              deleteTodo={deleteTodo}
              points={points}
              achievements={achievements}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="AddTodo">
          {(props) => <AddTodo {...props} addTodo={addTodo} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
