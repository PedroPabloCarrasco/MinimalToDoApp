import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { PriorityIndicator } from '../../components/PriorityIndicator';
import { format, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Ionicons } from '@expo/vector-icons';

export default function Home({ todos = [], onUpdate, deleteTodo, points, achievements }) {
  const [isHidden, setIsHidden] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigation = useNavigation();

  const filteredTodos = todos.filter(todo => {
    if (isHidden && todo.isCompleted) return false;
    const todoDate = new Date(todo.dueDate);
    return isSameDay(todoDate, selectedDate);
  });

  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const toggleTaskCompletion = (taskId) => {
    const updatedTodos = todos.map(todo =>
      todo.id === taskId ? { ...todo, isCompleted: !todo.isCompleted } : todo
    );
    onUpdate(updatedTodos);
  };

  const confirmDelete = (id) => {
    Alert.alert(
      '¿Eliminar tarea?',
      '¿Estás seguro de que deseas eliminar esta tarea?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', onPress: () => deleteTodo(id), style: 'destructive' }
      ]
    );
  };

  const renderTaskItem = ({ item }) => (
    <View style={[
      styles.taskItem,
      { borderLeftColor: getPriorityColor(item.priority) }
    ]}>
      <TouchableOpacity
        style={styles.taskContent}
        onPress={() => toggleTaskCompletion(item.id)}
      >
        <PriorityIndicator priority={item.priority} />
        <View style={styles.taskTextContainer}>
          <Text
            style={[
              styles.taskTitle,
              item.isCompleted && styles.completedTask
            ]}
            numberOfLines={1}
          >
            {item.title}
          </Text>
          {item.description && (
            <Text
              style={styles.taskDescription}
              numberOfLines={2}
            >
              {item.description}
            </Text>
          )}
          <Text style={styles.taskTime}>
            {format(new Date(item.dueDate), 'HH:mm', { locale: es })}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Botón eliminar */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => confirmDelete(item.id)}
      >
        <Ionicons name="trash-outline" size={22} color="#FF5252" />
      </TouchableOpacity>
    </View>
  );

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#FF5252';
      case 'medium': return '#FFC107';
      case 'low': return '#4CAF50';
      default: return '#9E9E9E';
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2599/2599636.png' }}
          style={styles.pic}
        />

        {/* Fecha y filtro */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.dateSelector}
          >
            <Text style={styles.dateText}>
              {format(selectedDate, "EEEE, d 'de' MMMM", { locale: es })}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setIsHidden(!isHidden)}
            hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
          >
            <Text style={styles.toggleText}>
              {isHidden ? 'Mostrar completadas' : 'Ocultar completadas'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Date Picker */}
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="calendar"
            onChange={handleDateChange}
            locale="es-ES"
            minimumDate={new Date()}
          />
        )}

        {/* Lista de tareas */}
        <FlatList
          data={filteredTodos}
          renderItem={renderTaskItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.taskList}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No hay tareas para este día</Text>
          }
          scrollEnabled={false}
        />

        {/* Puntos y Logros */}
        <View style={styles.infoContainer}>
          <Text style={styles.points}>⭐ Puntos: {points}</Text>
          {achievements.includes('5tasks') && <Text style={styles.achievement}>🏅 5 tareas completadas</Text>}
          {achievements.includes('10tasks') && <Text style={styles.achievement}>🥇 10 tareas completadas</Text>}
        </View>
      </ScrollView>

      {/* Botón agregar tarea */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddTodo', { selectedDate })}
        activeOpacity={0.8}
      >
        <Text style={styles.plus}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 100 },
  pic: { width: 42, height: 42, marginBottom: 20, borderRadius: 21, alignSelf: 'flex-end' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  dateSelector: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10, backgroundColor: '#f5f5f5' },
  dateText: { fontSize: 16, fontWeight: '600', color: '#333' },
  toggleText: { color: '#3478F6', fontSize: 14, fontWeight: '500' },
  taskList: { paddingBottom: 30 },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    borderLeftWidth: 4,
  },
  taskContent: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  taskTextContainer: { flex: 1, marginLeft: 12 },
  taskTitle: { fontSize: 16, fontWeight: '500', color: '#333', marginBottom: 4 },
  completedTask: { textDecorationLine: 'line-through', color: '#888' },
  taskDescription: { fontSize: 14, color: '#666', marginBottom: 4, lineHeight: 20 },
  taskTime: { fontSize: 12, color: '#888' },
  deleteButton: { paddingLeft: 10 },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#000',
    position: 'absolute',
    bottom: 30,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  plus: { fontSize: 32, color: '#fff', marginBottom: 2 },
  emptyText: { textAlign: 'center', color: '#888', marginTop: 20, fontSize: 16 },
  infoContainer: { marginTop: 20, alignItems: 'center' },
  points: { fontSize: 16, color: '#333', fontWeight: '600' },
  achievement: { fontSize: 14, color: '#4CAF50', marginTop: 4 }
});
