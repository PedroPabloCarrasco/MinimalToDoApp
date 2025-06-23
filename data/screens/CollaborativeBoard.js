// src/screens/CollaborativeBoard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CollaborativeBoard() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧑‍🤝‍🧑 Espacio Colaborativo</Text>
      <Text style={styles.subtitle}>Aquí irá tu tablero colaborativo 🚀</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#3478F6',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
  },
});
