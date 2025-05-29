import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AddTodo() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agregar tarea</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
  },
});
