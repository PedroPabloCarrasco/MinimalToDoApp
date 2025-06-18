import React from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, SafeAreaView, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Home({ navigation, todos, onUpdate, onDelete }) {
  // Etiqueta de prioridad
  const renderPriority = (priority) => {
    const color = priority === 'Alta' ? '#e53935' :
                  priority === 'Media' ? '#fb8c00' : '#43a047';
    return (
      <View style={[styles.priorityTag, { backgroundColor: color }]}>
        <Text style={styles.priorityText}>{priority}</Text>
      </View>
    );
  };

  // Confirmar eliminación
  const confirmDelete = (index) => {
    Alert.alert(
      'Eliminar tarea',
      '¿Estás seguro de que deseas eliminar esta tarea?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => onDelete(index),
        },
      ]
    );
  };

  // Cada item de la lista
  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('EditTodo', {
          todo: item,
          index,
          onUpdate,
        })
      }
      style={styles.todoCard}
    >
      <View style={styles.todoHeader}>
        <Text style={styles.todoTitle}>{item.name}</Text>
        {renderPriority(item.priority)}
      </View>
      <Text style={styles.todoTime}>
        📅 {item.date} - 🕒 {item.time} | {item.isToday ? 'Hoy' : 'Otro día'}
      </Text>
      {item.description ? (
        <Text style={styles.todoDescription}>{item.description}</Text>
      ) : null}
      {item.activities?.length > 0 && (
        <View style={styles.activities}>
          {item.activities.map((act, idx) => (
            <Text key={idx} style={styles.activityItem}>• {act}</Text>
          ))}
        </View>
      )}
      <TouchableOpacity
        onPress={() => confirmDelete(index)}
        style={styles.deleteButton}
      >
        <Ionicons name="trash" size={20} color="white" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

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
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 20,
    paddingTop: 40, // espacio superior
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    marginTop: 20, // espacio adicional bajo SafeArea
  },
  todoCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
    position: 'relative',
  },
  todoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  todoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
  },
  todoTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 6,
  },
  todoDescription: {
    fontSize: 15,
    color: '#333',
    marginTop: 10,
  },
  activities: {
    marginTop: 10,
  },
  activityItem: {
    fontSize: 14,
    color: '#444',
    marginLeft: 10,
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
    bottom: 12,
    right: 12,
    backgroundColor: '#e53935',
    padding: 8,
    borderRadius: 30,
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
