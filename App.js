import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import TodoList from './components/TodoList';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <TodoList />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
