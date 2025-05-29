import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './data/screens/Home';
import AddTodo from './data/screens/AddTodo';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="add"
          component={AddTodo}
          options={{ title: 'Agregar tarea' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
