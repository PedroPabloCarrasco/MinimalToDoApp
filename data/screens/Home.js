import * as React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import TodoList from '../../components/TodoList';
import { todosData } from '../todos';
import { useNavigation } from '@react-navigation/native';

export default function Home() {
  const navigation = useNavigation();

  const [localData, setLocalData] = React.useState(
    todosData.sort((a, b) => a.isCompleted - b.isCompleted)
  );

  const [isHidden, setIsHidden] = React.useState(false);

  const handleHidePress = () => {
    if (isHidden) {
      setIsHidden(false);
      setLocalData(todosData.sort((a, b) => a.isCompleted - b.isCompleted));
    } else {
      setIsHidden(true);
      setLocalData(localData.filter(todo => !todo.isCompleted));
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2599/2599636.png' }}
        style={styles.pic}
      />

      <View style={styles.header}>
        <Text style={styles.title}>Hoy</Text>
        <TouchableOpacity onPress={handleHidePress}>
          <Text style={styles.toggleText}>
            {isHidden ? 'Mostrar tareas completadas' : 'Ocultar tareas completadas'}
          </Text>
        </TouchableOpacity>
      </View>

      <TodoList todosData={localData.filter(todo => todo.isToday)} />

      <Text style={styles.title}>Mañana</Text>
      <TodoList todosData={todosData.filter(todo => !todo.isToday)} />

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('add')}
      >
        <Text style={styles.plus}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 70,
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  pic: {
    width: 50,
    height: 50,
    marginBottom: 20,
    borderRadius: 25,
    alignSelf: 'flex-end',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 35,
    marginTop: 10,
  },
  toggleText: {
    color: '#3478F6',
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#000',
    position: 'absolute',
    bottom: 40,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  plus: {
    fontSize: 40,
    color: '#fff',
  },
});
