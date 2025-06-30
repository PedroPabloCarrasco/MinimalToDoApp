import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  useColorScheme
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Habits({ habits, updateHabits }) {
  const [newHabit, setNewHabit] = useState('');
  const [editingHabit, setEditingHabit] = useState(null);
  const [editText, setEditText] = useState('');
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const addHabit = () => {
    if (newHabit.trim() === '') return;

    const habit = {
      id: Date.now().toString(),
      name: newHabit.trim(),
      streak: 0,
      completedToday: false,
      lastCompleted: null,
      createdAt: new Date().toISOString()
    };

    updateHabits([...habits, habit]);
    setNewHabit('');
  };

  const toggleHabitCompletion = (habitId) => {
    const updatedHabits = habits.map(habit => {
      if (habit.id === habitId) {
        const today = new Date().toISOString().split('T')[0];
        const lastCompleted = habit.lastCompleted?.split('T')[0];

        if (habit.completedToday) {
          return {
            ...habit,
            completedToday: false,
            streak: Math.max(0, habit.streak - 1),
            lastCompleted: null
          };
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        const newStreak = lastCompleted === yesterdayStr ? habit.streak + 1 : 1;

        return {
          ...habit,
          completedToday: true,
          streak: newStreak,
          lastCompleted: new Date().toISOString()
        };
      }
      return habit;
    });

    updateHabits(updatedHabits);
  };

  const startEditing = (habit) => {
    setEditingHabit(habit.id);
    setEditText(habit.name);
  };

  const saveEdit = () => {
    const updatedHabits = habits.map(habit =>
      habit.id === editingHabit ? { ...habit, name: editText } : habit
    );
    updateHabits(updatedHabits);
    setEditingHabit(null);
    setEditText('');
  };

  const deleteHabit = (habitId) => {
    Alert.alert(
      'Eliminar hábito',
      '¿Estás seguro de que quieres eliminar este hábito?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            updateHabits(habits.filter(h => h.id !== habitId));
          }
        }
      ]
    );
  };

  const renderHabitItem = ({ item }) => (
    <View style={[
      styles.habitItem,
      isDarkMode && styles.habitItemDark,
      item.completedToday && styles.completedHabit
    ]}>
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => toggleHabitCompletion(item.id)}
      >
        <Ionicons
          name={item.completedToday ? 'checkbox' : 'square-outline'}
          size={24}
          color="#4CAF50"
        />
      </TouchableOpacity>

      {editingHabit === item.id ? (
        <TextInput
          style={[styles.editInput, isDarkMode && styles.editInputDark]}
          value={editText}
          onChangeText={setEditText}
          autoFocus
          onSubmitEditing={saveEdit}
          onBlur={saveEdit}
        />
      ) : (
        <TouchableOpacity
          style={styles.habitTextContainer}
          onPress={() => startEditing(item)}
        >
          <Text style={[styles.habitName, isDarkMode && styles.textDark]}>
            {item.name}
          </Text>
          <Text style={[styles.streakText, isDarkMode && styles.textDark]}>
            🔥 Racha: {item.streak} día{item.streak !== 1 ? 's' : ''}
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteHabit(item.id)}
      >
        <Ionicons
          name="trash-outline"
          size={22}
          color="#FF5252"
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏆 Mis Hábitos</Text>
      <Text style={styles.subtitle}>Construye rutinas saludables día a día</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nuevo hábito..."
          placeholderTextColor={isDarkMode ? '#aaa' : '#999'}
          value={newHabit}
          onChangeText={setNewHabit}
          onSubmitEditing={addHabit}
        />
        <TouchableOpacity style={styles.addButton} onPress={addHabit}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {habits.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons
            name="repeat-outline"
            size={50}
            color={isDarkMode ? '#555' : '#ccc'}
            style={{ marginBottom: 15 }}
          />
          <Text style={styles.emptyText}>No hay hábitos registrados</Text>
          <Text style={styles.emptyText}>¡Agrega tu primer hábito!</Text>
        </View>
      ) : (
        <FlatList
          data={habits}
          renderItem={renderHabitItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    color: '#000',
    borderRadius: 8,
    padding: 12,
    marginRight: 10,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  habitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  habitItemDark: {
    backgroundColor: '#333',
  },
  completedHabit: {
    opacity: 0.8,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  checkbox: {
    marginRight: 15,
  },
  habitTextContainer: {
    flex: 1,
  },
  habitName: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  textDark: {
    color: '#eee',
  },
  streakText: {
    fontSize: 12,
    color: '#666',
  },
  deleteButton: {
    marginLeft: 10,
  },
  editInput: {
    flex: 1,
    backgroundColor: '#fff',
    color: '#000',
    borderRadius: 4,
    padding: 8,
    marginRight: 10,
    fontSize: 16,
  },
  editInputDark: {
    backgroundColor: '#444',
    color: '#fff',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
});
