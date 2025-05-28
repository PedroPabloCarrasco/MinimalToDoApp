import * as React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import TodoList from '../../components/TodoList';
import { todosData } from '../todos'; // asegúrate que está bien exportado

export default function Home() {
  const [localData, setLocalData] = React.useState(
    todosData.sort((a, b) => a.isCompleted - b.isCompleted)
  );

  const [isHidden, setisHidden] = React.useState(false);

  //Función para ocultar elementos
  const handleHidePress = () => {
    if (isHidden) {
        setisHidden(false)
        setLocalData(todosData.sort((a, b) => a.isCompleted - b.isCompleted))
        return;
    }
    setisHidden(!isHidden)
    //Filtramos las tareas y regresamos las tareas que no estan completadas
    setLocalData(localData.filter(todo => !todo.isCompleted)) 


  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2599/2599636.png' }}
        style={styles.pic}
      />

      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent:'space-between'}}>
        <Text style={styles.title}>Hoy</Text>

      <TouchableOpacity onPress={handleHidePress}>
        <Text style={{ color: '#3478F6' }}>{isHidden ? "Mostrar tareas completadas": "Ocultar tareas completadas"}</Text>
      </TouchableOpacity>
        </View>
      <TodoList todosData={localData.filter(todo => todo.isToday)} />
      

      <Text style={styles.title}>Mañana</Text>
      <TodoList todosData={todosData.filter(todo => !todo.isToday)} />
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
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 35,
    marginTop: 10,
  },
});
