import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  useColorScheme,
  Dimensions,
  Platform,
  Animated,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';

export default function Habits({ habits, updateHabits }) {
  const systemColorScheme = useColorScheme();
  // Estado para modo oscuro (por defecto según sistema)
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');

  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);
  const [newHabit, setNewHabit] = useState('');
  const [editingHabit, setEditingHabit] = useState(null);
  const [editText, setEditText] = useState('');
  const [completionHistory, setCompletionHistory] = useState({});
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenWidth(window.width);
    });
    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [habits]);

  // Si cambia el modo del sistema, actualizar el estado sólo si el usuario no ha cambiado manualmente (opcional)
  useEffect(() => {
    setIsDarkMode(systemColorScheme === 'dark');
  }, [systemColorScheme]);

  const formatDate = (date) => date.toISOString().split('T')[0];

  const addHabit = () => {
    if (newHabit.trim() === '') return;
    const habit = {
      id: Date.now().toString(),
      name: newHabit.trim(),
      streak: 0,
      completedToday: false,
      lastCompleted: null,
      createdAt: new Date().toISOString(),
    };
    updateHabits([...habits, habit]);
    setNewHabit('');
  };

  const toggleHabitCompletion = (habitId) => {
    const todayStr = formatDate(new Date());
    let completedCountToday = completionHistory[todayStr] || 0;

    const updatedHabits = habits.map((habit) => {
      if (habit.id === habitId) {
        if (habit.completedToday) {
          completedCountToday = Math.max(0, completedCountToday - 1);
          setCompletionHistory((prev) => ({
            ...prev,
            [todayStr]: completedCountToday,
          }));
          return {
            ...habit,
            completedToday: false,
            streak: Math.max(0, habit.streak - 1),
            lastCompleted: null,
          };
        } else {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = formatDate(yesterday);
          const newStreak =
            habit.lastCompleted?.split('T')[0] === yesterdayStr
              ? habit.streak + 1
              : 1;
          completedCountToday += 1;
          setCompletionHistory((prev) => ({
            ...prev,
            [todayStr]: completedCountToday,
          }));
          return {
            ...habit,
            completedToday: true,
            streak: newStreak,
            lastCompleted: new Date().toISOString(),
          };
        }
      }
      return habit;
    });

    updateHabits(updatedHabits);
  };

  const getLast7DaysData = () => {
    const data = [];
    const labels = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      labels.push(d.toLocaleDateString(undefined, { weekday: 'short' }));
      data.push(completionHistory[formatDate(d)] || 0);
    }
    return { labels, data };
  };

  const { labels, data } = getLast7DaysData();

  const startEditing = (habit) => {
    setEditingHabit(habit.id);
    setEditText(habit.name);
  };

  const saveEdit = () => {
    const updatedHabits = habits.map((habit) =>
      habit.id === editingHabit ? { ...habit, name: editText } : habit
    );
    updateHabits(updatedHabits);
    setEditingHabit(null);
    setEditText('');
  };

  const deleteHabit = (habitId) => {
    Alert.alert('Eliminar hábito', '¿Seguro que quieres eliminar este hábito?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => {
          updateHabits(habits.filter((h) => h.id !== habitId));
        },
      },
    ]);
  };

  // Componente para checkbox con animación
  const AnimatedCheckbox = ({ completed, onPress }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePress = () => {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.3,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
      onPress();
    };

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handlePress}
        style={{ marginRight: 18 }}
      >
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Ionicons
            name={completed ? 'checkbox' : 'square-outline'}
            size={30}
            color={isDarkMode ? '#81C784' : '#4CAF50'}
          />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  // Componente separado para cada ítem del hábito
  const HabitItem = ({
    item,
    index,
    toggleHabitCompletion,
    startEditing,
    editingHabit,
    editText,
    setEditText,
    saveEdit,
    deleteHabit,
    isDarkMode,
  }) => {
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
          styles.habitItem,
          isDarkMode && styles.habitItemDark,
          item.completedToday && styles.completedHabit,
          {
            opacity: opacityAnim,
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <AnimatedCheckbox
          completed={item.completedToday}
          onPress={() => toggleHabitCompletion(item.id)}
        />
        {editingHabit === item.id ? (
          <TextInput
            style={[styles.editInput, isDarkMode && styles.editInputDark]}
            value={editText}
            onChangeText={setEditText}
            autoFocus
            onSubmitEditing={saveEdit}
            onBlur={saveEdit}
            selectionColor={isDarkMode ? '#81C784' : '#4CAF50'}
          />
        ) : (
          <TouchableOpacity
            style={styles.habitTextContainer}
            onPress={() => startEditing(item)}
            activeOpacity={0.8}
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
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={26} color="#EF5350" />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderHabitItem = ({ item, index }) => (
    <HabitItem
      item={item}
      index={index}
      toggleHabitCompletion={toggleHabitCompletion}
      startEditing={startEditing}
      editingHabit={editingHabit}
      editText={editText}
      setEditText={setEditText}
      saveEdit={saveEdit}
      deleteHabit={deleteHabit}
      isDarkMode={isDarkMode}
    />
  );

  // Función para alternar modo oscuro
  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  return (
    <View style={[styles.container, isDarkMode && { backgroundColor: '#121212' }]}>
      {/* Botón modo oscuro arriba izquierda */}
      <TouchableOpacity
        style={styles.darkModeButton}
        onPress={toggleDarkMode}
        activeOpacity={0.7}
      >
        <Ionicons
          name={isDarkMode ? 'sunny' : 'moon'}
          size={28}
          color={isDarkMode ? '#FFC107' : '#555'}
        />
      </TouchableOpacity>

      <Text style={[styles.title, isDarkMode && { color: '#A5D6A7' }]}>🏆 Mis Hábitos</Text>
      <Text style={[styles.subtitle, isDarkMode && { color: '#CCC' }]}>
        Construye rutinas saludables día a día
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, isDarkMode && styles.inputDark]}
          placeholder="Nuevo hábito..."
          placeholderTextColor={isDarkMode ? '#999' : '#666'}
          value={newHabit}
          onChangeText={setNewHabit}
          onSubmitEditing={addHabit}
          selectionColor={isDarkMode ? '#81C784' : '#4CAF50'}
        />
        <TouchableOpacity
          style={[styles.addButton, isDarkMode && styles.addButtonDark]}
          onPress={addHabit}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {habits.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons
            name="repeat-outline"
            size={60}
            color={isDarkMode ? '#555' : '#CCC'}
            style={{ marginBottom: 20 }}
          />
          <Text style={[styles.emptyText, isDarkMode && { color: '#AAA' }]}>
            No hay hábitos registrados
          </Text>
          <Text style={[styles.emptyText, isDarkMode && { color: '#AAA' }]}>
            ¡Agrega tu primer hábito!
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={habits}
            renderItem={renderHabitItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 30 }}
            showsVerticalScrollIndicator={false}
          />

          <Text
            style={[
              styles.chartTitle,
              isDarkMode && { color: '#A5D6A7', marginTop: 10 },
            ]}
          >
            Hábitos completados en la última semana
          </Text>

          <LineChart
            data={{ labels, datasets: [{ data }] }}
            width={screenWidth - 40}
            height={180}
            fromZero
            chartConfig={{
              backgroundGradientFrom: isDarkMode ? '#1B5E20' : '#E8F5E9',
              backgroundGradientTo: isDarkMode ? '#2E7D32' : '#C8E6C9',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
              labelColor: (opacity = 1) =>
                isDarkMode
                  ? `rgba(165, 214, 167, ${opacity})`
                  : `rgba(0, 100, 0, ${opacity})`,
              propsForDots: {
                r: '7',
                strokeWidth: '3',
                stroke: '#66BB6A',
              },
            }}
            bezier
            style={{
              marginVertical: 16,
              borderRadius: 20,
              alignSelf: 'center',
              shadowColor: isDarkMode ? '#4CAF50' : '#388E3C',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.3,
              shadowRadius: 10,
              elevation: 6,
            }}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  darkModeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 20,
    zIndex: 10,
    padding: 8,
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#2E7D32',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 17,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    color: '#000',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    fontSize: 17,
    fontWeight: '600',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  inputDark: {
    backgroundColor: '#2A2A2A',
    color: '#C8E6C9',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOpacity: 0.8,
    shadowRadius: 7,
    elevation: 5,
  },
  addButtonDark: {
    backgroundColor: '#81C784',
  },
  habitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  habitItemDark: {
    backgroundColor: '#1B1B1B',
  },
  completedHabit: {
    borderLeftWidth: 6,
    borderLeftColor: '#4CAF50',
    opacity: 0.85,
  },
  checkbox: {
    marginRight: 18,
  },
  habitTextContainer: {
    flex: 1,
  },
  habitName: {
    fontSize: 18,
    color: '#333',
    fontWeight: '700',
    marginBottom: 6,
  },
  textDark: {
    color: '#E0E0E0',
  },
  streakText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
  },
  deleteButton: {
    marginLeft: 14,
  },
  editInput: {
    flex: 1,
    backgroundColor: '#fff',
    color: '#000',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 17,
    fontWeight: '600',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  editInputDark: {
    backgroundColor: '#333',
    color: '#C8E6C9',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 70,
  },
  emptyText: {
    fontSize: 17,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 24,
    color: '#2E7D32',
  },
});
