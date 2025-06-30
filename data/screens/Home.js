import React, { useState, useEffect, useRef } from 'react';
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
  Animated,
  Easing,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Ionicons } from '@expo/vector-icons';

// Asegúrate de tener este componente PriorityIndicator en ../../components/PriorityIndicator
import { PriorityIndicator } from '../../components/PriorityIndicator';

const STORAGE_KEY = 'APP_DARK_MODE';

export default function Home({ todos = [], onUpdate, deleteTodo, points = 0, achievements = [] }) {
  const systemColorScheme = useColorScheme();
  const navigation = useNavigation();

  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');
  const [isHidden, setIsHidden] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [sortBy, setSortBy] = useState('time');

  // Cargar modo oscuro guardado
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(value => {
      if (value !== null) setIsDarkMode(value === 'true');
    });
  }, []);

  // Guardar modo oscuro en AsyncStorage
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, isDarkMode.toString());
  }, [isDarkMode]);

  // Limpiar filtros
  const clearFilters = () => {
    setSearchText('');
    setSelectedPriority('all');
    setSelectedDate(null);
    setIsHidden(false);
  };

  // Convierte texto prioridad a clave interna
  const priorityTextToValue = (text) => {
    switch (text.toLowerCase()) {
      case 'alta': return 'high';
      case 'media': return 'medium';
      case 'baja': return 'low';
      default: return 'all';
    }
  };

  // Ordenar tareas
  const sortTodos = (list) => {
    if (sortBy === 'priority') {
      const priorityOrder = { high: 1, medium: 2, low: 3, undefined: 4 };
      return list.slice().sort((a, b) =>
        (priorityOrder[a.priority] || 4) - (priorityOrder[b.priority] || 4)
      );
    }
    return list.slice().sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  };

  // Filtrar tareas
  const filteredTodos = sortTodos(
    todos.filter(todo => {
      const todoDate = new Date(todo.dueDate);

      const matchesDate = !selectedDate || isSameDay(todoDate, selectedDate);
      const matchesStatus = !(isHidden && todo.isCompleted);
      const matchesSearch =
        todo.title.toLowerCase().includes(searchText.toLowerCase()) ||
        (todo.description && todo.description.toLowerCase().includes(searchText.toLowerCase()));
      const matchesPriority =
        selectedPriority === 'all' ||
        todo.priority === priorityTextToValue(selectedPriority);

      return matchesDate && matchesStatus && matchesSearch && matchesPriority;
    })
  );

  const totalTasks = todos.length;
  const completedTasks = todos.filter(t => t.isCompleted).length;
  const pendingTasks = totalTasks - completedTasks;

  // Cambiar estado completado de tarea
  const toggleTaskCompletion = (taskId) => {
    const updatedTodos = todos.map(todo =>
      todo.id === taskId ? { ...todo, isCompleted: !todo.isCompleted } : todo
    );
    onUpdate(updatedTodos);
  };

  // Confirmar eliminación
  const confirmDelete = (id) => {
    Alert.alert('¿Eliminar tarea?', '¿Estás seguro de que deseas eliminar esta tarea?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', onPress: () => deleteTodo(id), style: 'destructive' }
    ]);
  };

  // Componente de cada tarea con animaciones
  const TaskItem = ({ item, index }) => {
    const slideAnim = useRef(new Animated.Value(50)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          delay: index * 100,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 400,
          delay: index * 100,
          useNativeDriver: true,
        }),
      ]).start();
    }, []);

    return (
      <Animated.View
        style={[
          styles.taskItem,
          { borderLeftColor: getPriorityColor(item.priority) },
          { opacity: opacityAnim, transform: [{ translateX: slideAnim }] },
        ]}
      >
        <TouchableOpacity
          style={styles.taskContent}
          onPress={() => toggleTaskCompletion(item.id)}
          activeOpacity={0.7}
        >
          <PriorityIndicator priority={item.priority} />
          <View style={styles.taskTextContainer}>
            <Text style={[styles.taskTitle, item.isCompleted && styles.completedTask]} numberOfLines={1}>
              {item.title}
            </Text>
            {item.description && (
              <Text style={styles.taskDescription} numberOfLines={2}>
                {item.description}
              </Text>
            )}
            <Text style={styles.taskTime}>
              {format(new Date(item.dueDate), 'HH:mm', { locale: es })}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDelete(item.id)} activeOpacity={0.7}>
          <Ionicons name="trash-outline" size={22} color="#FF5252" />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // Animación botón agregar
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const onPressInAdd = () => {
    Animated.spring(scaleAnim, { toValue: 0.9, useNativeDriver: true }).start();
  };

  const onPressOutAdd = () => {
    Animated.spring(scaleAnim, { toValue: 1, friction: 3, tension: 40, useNativeDriver: true }).start();
  };

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.1, duration: 1000, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  const styles = isDarkMode ? darkStyles : lightStyles;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">

        <View style={styles.topRightButton}>
          <TouchableOpacity onPress={() => setIsDarkMode(!isDarkMode)}>
            <Ionicons
              name={isDarkMode ? 'sunny-outline' : 'moon-outline'}
              size={28}
              color={isDarkMode ? '#FFC107' : '#555'}
            />
          </TouchableOpacity>
        </View>

        <Image source={require('../../assets/icon.png')} style={styles.pic} />

        <View style={styles.header}>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateSelector}>
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
              setShowDatePicker(false);
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
          {['all', 'Alta', 'Media', 'Baja'].map(label => {
            const isSelected = selectedPriority === label;
            const priorityKey = label === 'all' ? undefined : priorityTextToValue(label);
            return (
              <TouchableOpacity
                key={label}
                style={[
                  styles.priorityFilterButton,
                  isSelected && styles.priorityFilterButtonActive,
                  { borderColor: getPriorityColor(priorityKey) }
                ]}
                onPress={() => setSelectedPriority(label)}
              >
                <Text style={[styles.priorityFilterText, isSelected && styles.priorityFilterTextActive]}>
                  {label === 'all' ? 'Todas' : label}
                </Text>
              </TouchableOpacity>
            );
          })}
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
          renderItem={({ item, index }) => <TaskItem item={item} index={index} />}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.taskList}
          ListEmptyComponent={<Text style={styles.emptyText}>No hay tareas</Text>}
          scrollEnabled={false}
        />

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

        <View style={styles.infoContainer}>
          <Text style={styles.points}>⭐ Puntos: {points}</Text>
          {achievements.includes('5tasks') && <Text style={styles.achievement}>🏅 5 tareas completadas</Text>}
          {achievements.includes('10tasks') && <Text style={styles.achievement}>🥇 10 tareas completadas</Text>}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.collabButton, { backgroundColor: '#00BCD4' }]}
        onPress={() => navigation.navigate('Habits')}
        activeOpacity={0.8}
      >
        <Ionicons name="repeat-outline" size={28} color="#fff" />
        <Text style={styles.collabButtonText}>Hábitos</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.collabButton, { bottom: 160, backgroundColor: '#4CAF50' }]}
        onPress={() => navigation.navigate('Finance')}
        activeOpacity={0.8}
      >
        <Ionicons name="wallet-outline" size={28} color="#fff" />
        <Text style={styles.collabButtonText}>Finanzas</Text>
      </TouchableOpacity>

      <Animated.View style={[styles.addButton, { transform: [{ scale: scaleAnim }] }]}>
        <TouchableOpacity
          onPress={() => navigation.navigate('AddTodo', { selectedDate })}
          activeOpacity={0.8}
          onPressIn={onPressInAdd}
          onPressOut={onPressOutAdd}
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Text style={styles.plus}>+</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );

  function getPriorityColor(priority) {
    switch (priority) {
      case 'high': return '#FF5252';
      case 'medium': return '#FFC107';
      case 'low': return '#4CAF50';
      default: return '#9E9E9E';
    }
  }
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
  points: { fontSize: 16, fontWeight: '600', color: '#333' },
  achievement: { fontSize: 14, marginTop: 4 },
  statsBox: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 14,
    marginTop: 10,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: 22, fontWeight: '700', color: '#333' },
  statLabel: { fontSize: 14, color: '#555' },
  collabButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5,
  },
  collabButtonText: {
    color: '#fff',
    fontWeight: '700',
    marginLeft: 8,
    fontSize: 16,
  },
topRightButton: {
  position: 'absolute',
  top: 60,  // o el valor que prefieras para la distancia desde arriba
  left: 15, // botón a la izquierda
  width: 44,    // tamaño fijo (ajusta según tamaño del ícono)
  height: 44,
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 10,
},



});

const darkStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  scrollContainer: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 100 },
  pic: { width: 42, height: 42, marginBottom: 20, borderRadius: 21, alignSelf: 'flex-end' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  dateSelector: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10, backgroundColor: '#333' },
  dateText: { fontSize: 16, fontWeight: '600', color: '#eee' },
  toggleText: { color: '#5AB4F8', fontSize: 14, fontWeight: '500' },
  searchInput: {
    backgroundColor: '#222',
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
    color: '#aaa',
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
    backgroundColor: '#5AB4F8',
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
  completedTask: { textDecorationLine: 'line-through', color: '#777' },
  taskDescription: { fontSize: 14, color: '#bbb', marginBottom: 4, lineHeight: 20 },
  taskTime: { fontSize: 12, color: '#999' },
  deleteButton: { paddingLeft: 10 },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 30,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  plus: { fontSize: 32, color: '#000', marginBottom: 2 },
  emptyText: { textAlign: 'center', color: '#777', marginTop: 20, fontSize: 16 },
  infoContainer: { marginTop: 20, alignItems: 'center' },
  points: { fontSize: 16, fontWeight: '600', color: '#eee' },
  achievement: { fontSize: 14, marginTop: 4, color: '#ccc' },
  statsBox: {
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 14,
    marginTop: 10,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
    color: '#eee',
  },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: 22, fontWeight: '700', color: '#eee' },
  statLabel: { fontSize: 14, color: '#aaa' },
  collabButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5,
  },
  collabButtonText: {
    color: '#fff',
    fontWeight: '700',
    marginLeft: 8,
    fontSize: 16,
  },
  topRightButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 10,
  },
});
