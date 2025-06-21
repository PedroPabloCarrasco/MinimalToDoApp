import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert,
  TextInput,
  Platform,
  useColorScheme,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { PriorityIndicator } from '../../components/PriorityIndicator';
import { format, isSameDay, isWithinInterval } from 'date-fns';
import { es } from 'date-fns/locale';
import { Ionicons } from '@expo/vector-icons';

const STORAGE_KEY = 'APP_DARK_MODE';

export default function Home({ todos = [], onUpdate, deleteTodo, points, achievements }) {
  const systemColorScheme = useColorScheme();

  // Estado para modo oscuro con persistencia
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');

  useEffect(() => {
    // Al montar, leer el modo guardado
    AsyncStorage.getItem(STORAGE_KEY).then(value => {
      if (value !== null) {
        setIsDarkMode(value === 'true');
      }
    });
  }, []);

  useEffect(() => {
    // Guardar cambio de modo en AsyncStorage
    AsyncStorage.setItem(STORAGE_KEY, isDarkMode.toString());
  }, [isDarkMode]);

  const [isHidden, setIsHidden] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [sortBy, setSortBy] = useState('time'); // 'time' o 'priority'
  const navigation = useNavigation();

  const clearFilters = () => {
    setSearchText('');
    setSelectedPriority('all');
    setSelectedDate(null);
    setFromDate(null);
    setToDate(null);
    setIsHidden(false);
  };

  const sortTodos = (list) => {
    if (sortBy === 'priority') {
      const priorityOrder = { high: 1, medium: 2, low: 3, undefined: 4 };
      return list.slice().sort((a, b) =>
        (priorityOrder[a.priority] || 4) - (priorityOrder[b.priority] || 4)
      );
    }
    return list.slice().sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  };

  const filteredTodos = sortTodos(
    todos.filter(todo => {
      const todoDate = new Date(todo.dueDate);

      const matchesDate =
        (!selectedDate && !fromDate && !toDate) ||
        (selectedDate && isSameDay(todoDate, selectedDate)) ||
        (fromDate && toDate && isWithinInterval(todoDate, { start: fromDate, end: toDate })) ||
        (fromDate && !toDate && todoDate >= fromDate) ||
        (!fromDate && toDate && todoDate <= toDate);

      const matchesStatus = !(isHidden && todo.isCompleted);

      const matchesSearch =
        todo.title.toLowerCase().includes(searchText.toLowerCase()) ||
        (todo.description && todo.description.toLowerCase().includes(searchText.toLowerCase()));

      const matchesPriority =
        selectedPriority === 'all' || todo.priority === selectedPriority;

      return matchesDate && matchesStatus && matchesSearch && matchesPriority;
    })
  );

  // Estadísticas
  const totalTasks = todos.length;
  const completedTasks = todos.filter(t => t.isCompleted).length;
  const pendingTasks = totalTasks - completedTasks;

  const toggleTaskCompletion = (taskId) => {
    const updatedTodos = todos.map(todo =>
      todo.id === taskId ? { ...todo, isCompleted: !todo.isCompleted } : todo
    );
    onUpdate(updatedTodos);
  };

  const confirmDelete = (id) => {
    Alert.alert('¿Eliminar tarea?', '¿Estás seguro de que deseas eliminar esta tarea?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', onPress: () => deleteTodo(id), style: 'destructive' }
    ]);
  };

  const renderTaskItem = ({ item }) => (
    <View style={[styles.taskItem, { borderLeftColor: getPriorityColor(item.priority) }]}>
      <TouchableOpacity style={styles.taskContent} onPress={() => toggleTaskCompletion(item.id)}>
        <PriorityIndicator priority={item.priority} />
        <View style={styles.taskTextContainer}>
          <Text style={[styles.taskTitle, item.isCompleted && styles.completedTask]} numberOfLines={1}>
            {item.title}
          </Text>
          {item.description && (
            <Text style={styles.taskDescription} numberOfLines={2}>{item.description}</Text>
          )}
          <Text style={styles.taskTime}>{format(new Date(item.dueDate), 'HH:mm', { locale: es })}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDelete(item.id)}>
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

  const styles = isDarkMode ? darkStyles : lightStyles;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">

        {/* Botón para modo oscuro/claro */}
        <View style={styles.topRightButton}>
          <TouchableOpacity onPress={() => setIsDarkMode(!isDarkMode)} style={{ padding: 6 }}>
            <Ionicons
              name={isDarkMode ? 'sunny-outline' : 'moon-outline'}
              size={28}
              color={isDarkMode ? '#FFC107' : '#555'}
            />
          </TouchableOpacity>
        </View>

        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2599/2599636.png' }}
          style={styles.pic}
        />

        <View style={styles.header}>
          <TouchableOpacity onPress={() => setShowDatePicker('selected')} style={styles.dateSelector}>
            <Text style={styles.dateText}>
              {selectedDate
                ? format(selectedDate, "EEEE, d 'de' MMMM", { locale: es })
                : 'Selecciona una fecha'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsHidden(!isHidden)} hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}>
            <Text style={styles.toggleText}>
              {isHidden ? 'Mostrar completadas' : 'Ocultar completadas'}
            </Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate || new Date()}
            mode="date"
            display="calendar"
            onChange={(e, date) => {
              setShowDatePicker(null);
              if (date) setSelectedDate(date);
            }}
            locale="es-ES"
            minimumDate={new Date()}
          />
        )}

        <TextInput
          placeholder="Buscar tareas..."
          value={searchText}
          onChangeText={setSearchText}
          style={styles.searchInput}
          placeholderTextColor={isDarkMode ? '#aaa' : '#666'}
        />

        <View style={styles.priorityFilterContainer}>
          {['all', 'Alta', 'Media', 'Baja'].map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.priorityFilterButton,
                selectedPriority === level && styles.priorityFilterButtonActive,
                { borderColor: getPriorityColor(level === 'all' ? undefined : level) }
              ]}
              onPress={() => setSelectedPriority(level)}
            >
              <Text
                style={[
                  styles.priorityFilterText,
                  selectedPriority === level && styles.priorityFilterTextActive,
                ]}
              >
                {level === 'all' ? 'Todas' : level.charAt(0).toUpperCase() + level.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.filterButtonsRow}>
          <TouchableOpacity style={styles.clearFiltersBtn} onPress={clearFilters}>
            <Text style={styles.clearFiltersText}>Limpiar filtros</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sortBtn}
            onPress={() => setSortBy(sortBy === 'time' ? 'priority' : 'time')}
          >
            <Text style={styles.sortBtnText}>
              Ordenar: {sortBy === 'time' ? 'Hora' : 'Prioridad'}
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={filteredTodos}
          renderItem={renderTaskItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.taskList}
          ListEmptyComponent={<Text style={styles.emptyText}>No hay tareas</Text>}
          scrollEnabled={false}
        />

        {/* Estadísticas en cuadro */}
        <View style={styles.statsBox}>
          <Text style={styles.statsTitle}>Estadísticas de tareas</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{totalTasks}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{pendingTasks}</Text>
              <Text style={styles.statLabel}>Pendientes</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{completedTasks}</Text>
              <Text style={styles.statLabel}>Completadas</Text>
            </View>
          </View>
        </View>

        {/* Puntos y logros */}
        <View style={styles.infoContainer}>
          <Text style={styles.points}>⭐ Puntos: {points}</Text>
          {achievements.includes('5tasks') && <Text style={styles.achievement}>🏅 5 tareas completadas</Text>}
          {achievements.includes('10tasks') && <Text style={styles.achievement}>🥇 10 tareas completadas</Text>}
        </View>
      </ScrollView>

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

const lightStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 100 },
  pic: { width: 42, height: 42, marginBottom: 20, borderRadius: 21, alignSelf: 'flex-end' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  dateSelector: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10, backgroundColor: '#f5f5f5' },
  dateText: { fontSize: 16, fontWeight: '600', color: '#333' },
  toggleText: { color: '#3478F6', fontSize: 14, fontWeight: '500' },
  searchInput: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    marginBottom: 12,
    fontSize: 16,
    color: '#333',
  },
  priorityFilterContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    justifyContent: 'space-around',
  },
  priorityFilterButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#ccc',
  },
  priorityFilterButtonActive: {
    backgroundColor: '#e0e0e0',
  },
  priorityFilterText: {
    color: '#555',
    fontWeight: '600',
  },
  priorityFilterTextActive: {
    color: '#000',
  },
  filterButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  clearFiltersBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#FF5252',
    borderRadius: 20,
  },
  clearFiltersText: {
    color: '#fff',
    fontWeight: '700',
  },
  sortBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#3478F6',
    borderRadius: 20,
  },
  sortBtnText: {
    color: '#fff',
    fontWeight: '700',
  },
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
  achievement: { fontSize: 14, color: '#4CAF50', marginTop: 4 },

  // Estadísticas cuadro
  statsBox: {
    backgroundColor: '#e0e0e0',
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 24,
    marginTop: 30,
    alignItems: 'center',
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#333',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333',
  },
  statLabel: {
    fontSize: 14,
    color: '#555',
    marginTop: 6,
  },
});

const darkStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  scrollContainer: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 100 },
  pic: { width: 42, height: 42, marginBottom: 20, borderRadius: 21, alignSelf: 'flex-end' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  dateSelector: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10, backgroundColor: '#333' },
  dateText: { fontSize: 16, fontWeight: '600', color: '#eee' },
  toggleText: { color: '#4A90E2', fontSize: 14, fontWeight: '500' },
  searchInput: {
    backgroundColor: '#333',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    marginBottom: 12,
    fontSize: 16,
    color: '#eee',
  },
  priorityFilterContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    justifyContent: 'space-around',
  },
  priorityFilterButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#555',
  },
  priorityFilterButtonActive: {
    backgroundColor: '#555',
  },
  priorityFilterText: {
    color: '#ccc',
    fontWeight: '600',
  },
  priorityFilterTextActive: {
    color: '#fff',
  },
  filterButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  clearFiltersBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#FF5252',
    borderRadius: 20,
  },
  clearFiltersText: {
    color: '#fff',
    fontWeight: '700',
  },
  sortBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#3478F6',
    borderRadius: 20,
  },
  sortBtnText: {
    color: '#fff',
    fontWeight: '700',
  },
  taskList: { paddingBottom: 30 },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#222',
    borderRadius: 12,
    borderLeftWidth: 4,
  },
  taskContent: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  taskTextContainer: { flex: 1, marginLeft: 12 },
  taskTitle: { fontSize: 16, fontWeight: '500', color: '#eee', marginBottom: 4 },
  completedTask: { textDecorationLine: 'line-through', color: '#888' },
  taskDescription: { fontSize: 14, color: '#bbb', marginBottom: 4, lineHeight: 20 },
  taskTime: { fontSize: 12, color: '#aaa' },
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
  points: { fontSize: 16, color: '#eee', fontWeight: '600' },
  achievement: { fontSize: 14, color: '#4CAF50', marginTop: 4 },

  // Estadísticas cuadro
  statsBox: {
    backgroundColor: '#222',
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 24,
    marginTop: 30,
    alignItems: 'center',
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#eee',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: '#eee',
  },
  statLabel: {
    fontSize: 14,
    color: '#bbb',
    marginTop: 6,
  },
});

