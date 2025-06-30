import React, { useState, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons'; // Importa Ionicons para los iconos

import Home from './data/screens/Home';
import AddTodo from './data/screens/AddTodo';
import Finance from './data/screens/Finance';
import AddExpense from './data/screens/AddExpense';
import WeeklyCalendar from './data/screens/WeeklyCalendar';
import Habits from './data/screens/Habits';

const Stack = createNativeStackNavigator();

export default function App() {
  const [todos, setTodos] = useState([]);
  const [points, setPoints] = useState(0);
  const [achievements, setAchievements] = useState([]);
  const [habits, setHabits] = useState([]);

  // Cargar todos los datos al iniciar
  useEffect(() => {
    const loadData = async () => {
      try {
        const [todosData, pointsData, achData, habitsData] = await Promise.all([
          AsyncStorage.getItem('@todos'),
          AsyncStorage.getItem('@points'),
          AsyncStorage.getItem('@achievements'),
          AsyncStorage.getItem('@habits')
        ]);

        if (todosData) setTodos(JSON.parse(todosData));
        if (pointsData) setPoints(parseInt(pointsData, 10));
        if (achData) setAchievements(JSON.parse(achData));
        if (habitsData) setHabits(JSON.parse(habitsData));
      } catch (error) {
        console.log('Error cargando datos:', error);
      }
    };
    loadData();
  }, []);

  // Guardar datos cuando cambian
  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.multiSet([
          ['@todos', JSON.stringify(todos)],
          ['@points', points.toString()],
          ['@achievements', JSON.stringify(achievements)],
          ['@habits', JSON.stringify(habits)]
        ]);
      } catch (error) {
        console.log('Error guardando datos:', error);
      }
    };
    saveData();
  }, [todos, points, achievements, habits]);

  const addTodo = (newTodo) => {
    setTodos((prevTodos) => [...prevTodos, newTodo]);
  };

  const updateTodos = (updatedTodos) => {
    setTodos(updatedTodos);
    const completedCount = updatedTodos.filter((t) => t.isCompleted).length;
    setPoints(completedCount * 10);

    // Lógica de logros
    const newAchievements = [...achievements];
    if (completedCount >= 5 && !newAchievements.includes('5tasks')) {
      newAchievements.push('5tasks');
      alert('🎉 ¡Logro desbloqueado: Completaste 5 tareas!');
    }
    if (completedCount >= 10 && !newAchievements.includes('10tasks')) {
      newAchievements.push('10tasks');
      alert('🏆 ¡Logro desbloqueado: Completaste 10 tareas!');
    }
    setAchievements(newAchievements);
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={({ navigation }) => ({
          headerShown: true,
          animation: 'fade',
          headerStyle: {
            backgroundColor: '#f8f9fa',
          },
          headerTintColor: '#4CAF50', // Color verde para el texto e iconos
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color="#4CAF50" />
            </TouchableOpacity>
          ),
        })}
      >
        <Stack.Screen 
          name="Home" 
          options={{ headerShown: false }}
        >
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
        
        <Stack.Screen 
          name="AddTodo" 
          options={{ title: 'Agregar Tarea' }}
        >
          {(props) => <AddTodo {...props} addTodo={addTodo} />}
        </Stack.Screen>
        
        <Stack.Screen 
          name="Finance" 
          component={Finance} 
          options={{ title: 'Finanzas' }} 
        />
        
        <Stack.Screen 
          name="AddExpense" 
          component={AddExpense} 
          options={{ title: 'Agregar Gasto' }} 
        />
        
        <Stack.Screen 
          name="WeeklyCalendar"
          options={{ title: 'Calendario Semanal' }}
        >
          {(props) => <WeeklyCalendar {...props} todos={todos} />}
        </Stack.Screen>
        
        <Stack.Screen 
          name="Habits"
          options={{ title: 'Mis Hábitos' }}
        >
          {(props) => (
            <Habits
              {...props}
              habits={habits}
              updateHabits={setHabits}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}