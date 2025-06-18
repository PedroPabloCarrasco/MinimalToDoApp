import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, SafeAreaView, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Tasks({ todos, onUpdate, onDelete, navigation }) {
  const [completed, setCompleted] = useState([]);

  const renderPriority = (priority) => {
    const color = priority === 'Alta' ? '#e53935' : priority === 'Media' ? '#fb8c00' : '#43a047';
    return (
      <View style={[styles.priorityTag, { backgroundColor: color }]}>
        <Text style={styles.priorityText}>{priority}</Text>
      </View>
    );
  };

  const confirmDelete = (index) => {
    Alert.alert('Eliminar tarea', '¿Estás seguro de eliminar esta tarea?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => onDelete(index),
      },
    ]);
  };

  const toggleComplete = (index) => {
    if (completed.includes(index)) {
      setCompleted(completed.filter((i) => i !== index));
    } else {
      setCompleted([...completed, index]);
    }
  };

  const renderItem = ({ item, index }) => {
    const isCompleted = completed.includes(index);
    return (
      <View style={[styles.todoCard, isCompleted && styles.completedCard]}>
        <TouchableOpacity
          onPress={() => navigation.navigate('EditTodo', {
            todo: item,
            index,
            onUpdate,
          })}
          style={{ flex: 1 }}
        >
          <View style={styles.todoHeader}>
            <Text style={[styles.todoTitle, isCompleted && styles.completedText]}>
              {item.name}
            </Text>
            {renderPriority(item.priority)}
          </View>

          <Text style={[styles.todoTime, isCompleted && styles.completedText]}>
            📅 {item.date} — 🕒 {item.time}
          </Text>

          {item.description ? (
            <Text style={[styles.todoDescription, isCompleted && styles.completedText]}>
              {item.description}
            </Text>
          ) : null}
        </TouchableOpacity>

        {/* ✅ Botón completar */}
        <TouchableOpacity onPress={() => toggleComplete(index)} style={styles.completeButton}>
          <Ionicons name={isCompleted ? 'checkmark-circle' : 'ellipse-outline'} size={24} color={isCompleted ? '#4caf50' : '#ccc'} />
        </TouchableOpacity>

        {/* 🗑️ Botón eliminar */}
        <TouchableOpacity onPress={() => confirmDelete(index)} style={styles.deleteButton}>
          <Ionicons name="trash" size={24} color="#e53935" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Mis Tareas</Text>

      <FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <TouchableOpacity
        onPress={() => navigation.navigate('AddTodo')}
        style={styles.fab}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2', padding: 20 },
  header: {
    fontSize: 28, fontWeight: 'bold',
    marginBottom: 20, textAlign: 'center', marginTop: 10
  },
  todoCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
    position: 'relative',
  },
  completedCard: {
    backgroundColor: '#d7ffd9',
  },
  todoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  todoTitle: {
    fontSize: 18, fontWeight: 'bold', color: '#111',
  },
  todoTime: {
    fontSize: 14, color: '#666', marginTop: 6,
  },
  todoDescription: {
    fontSize: 15, color: '#333', marginTop: 10,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  priorityTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  priorityText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 40,
    borderRadius: 8,
  },
  completeButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 6,
    borderRadius: 8,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#000',
    padding: 18,
    borderRadius: 100,
    elevation: 6,
  },
});
