// archivo: components/TodoList.js

import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { todosData } from '../data/todo';
import Todo from './Todo';

export default function TodoList() {
  return (
    <FlatList
      data={todosData}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <Todo {...item} />}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 10,
  },
});
