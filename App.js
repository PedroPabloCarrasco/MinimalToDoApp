import React, { useState, useEffect } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { registerForPushNotificationsAsync } from './data/utils/notifications';

import Home from './data/screens/Home';
import AddTodo from './data/screens/AddTodo';
import EditTodo from './data/screens/EditTodo';


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TasksStack({ todos, onUpdate, onDelete }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home">
        {(props) => (
          <Home {...props} todos={todos} onUpdate={onUpdate} onDelete={onDelete} />
        )}
      </Stack.Screen>
      <Stack.Screen name="EditTodo">
        {(props) => (
          <EditTodo {...props} onUpdate={onUpdate} />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

export default function App() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  const addTodo = (todo) => setTodos((prev) => [...prev, todo]);

  const updateTodo = (index, updatedTodo) => {
    setTodos((prev) => {
      const newTodos = [...prev];
      newTodos[index] = updatedTodo;
      return newTodos;
    });
  };

  const deleteTodo = (index) => {
    setTodos((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Tasks') iconName = 'list';
            else if (route.name === 'AddTodo') iconName = 'add-circle';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#000',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen
  name="Tasks"
  options={{ tabBarLabel: 'Tareas' }}
>
  {(props) => (
    <TasksStack
      {...props}
      todos={todos}
      onUpdate={updateTodo}
      onDelete={deleteTodo}
    />
  )}
</Tab.Screen>


<Tab.Screen
  name="AddTodo"
  options={{ tabBarLabel: 'Agregar Tarea' }}
>
  {(props) => (
    <AddTodo {...props} onAdd={addTodo} />
  )}
</Tab.Screen>

      </Tab.Navigator>
    </NavigationContainer>
  );
}
