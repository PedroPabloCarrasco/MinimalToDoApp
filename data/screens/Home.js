import * as React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import TodoList from '../../components/TodoList';

export default function Home() {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2599/2599636.png' }}
        style={styles.pic}
      />

    <Text style={styles.title}>Hoy</Text>
    <Text style={styles.title}>Mañana</Text>


      <TodoList />
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
    borderRadius: 21,
    alignSelf:'flex-end'
  },

  title: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 35,
    marginTop: 10,
  }
});
