import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  useColorScheme
} from 'react-native';
import { CalendarList } from 'react-native-calendars';
import { format, parseISO, isValid, isToday } from 'date-fns';

export default function WeeklyCalendar({ route, navigation }) {
  const isDarkMode = useColorScheme() === 'dark';
  const todos = route.params?.todos || [];

  // Función para obtener color según prioridad
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#f44336'; // Rojo
      case 'medium':
        return '#ff9800'; // Naranja
      case 'low':
        return '#4caf50'; // Verde
      default:
        return '#2196f3'; // Azul por defecto
    }
  };

  // Preparar fechas marcadas
  const markedDates = {};
  todos.forEach((todo) => {
    try {
      if (!todo.dueDate) return;

      const dateObj = typeof todo.dueDate === 'string' ? parseISO(todo.dueDate) : new Date(todo.dueDate);
      if (!isValid(dateObj)) {
        console.warn('Fecha inválida:', todo.dueDate);
        return;
      }

      const dateStr = format(dateObj, 'yyyy-MM-dd');

      markedDates[dateStr] = {
        dots: [
          {
            color: getPriorityColor(todo.priority),
            selectedColor: '#ffffff'
          }
        ],
        selected: isToday(dateObj),
        selectedColor: '#3F51B5'
      };
    } catch (error) {
      console.warn('Error procesando tarea:', error);
    }
  });

  const handleDayPress = (day) => {
    const tasksForDay = todos.filter((todo) => {
      try {
        const dateObj = typeof todo.dueDate === 'string' ? parseISO(todo.dueDate) : new Date(todo.dueDate);
        return format(dateObj, 'yyyy-MM-dd') === day.dateString;
      } catch {
        return false;
      }
    });

    if (tasksForDay.length > 0) {
      navigation.navigate('DayTasks', {
        date: day.dateString,
        tasks: tasksForDay
      });
    } else {
      Alert.alert(
        `No hay tareas para ${format(new Date(day.dateString), 'PPPP')}`,
        '¿Deseas agregar una nueva tarea para este día?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Agregar',
            onPress: () =>
              navigation.navigate('AddTodo', { selectedDate: day.dateString })
          }
        ]
      );
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#121212' : '#f8f9fa'
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    emptyText: {
      fontSize: 18,
      color: isDarkMode ? '#aaa' : '#666',
      marginBottom: 20
    },
    addButton: {
      backgroundColor: '#3F51B5',
      padding: 12,
      borderRadius: 5
    },
    addButtonText: {
      color: 'white',
      fontWeight: 'bold'
    }
  });

  const calendarTheme = {
    backgroundColor: isDarkMode ? '#121212' : '#f8f9fa',
    calendarBackground: isDarkMode ? '#121212' : '#f8f9fa',
    textSectionTitleColor: isDarkMode ? '#fff' : '#333',
    selectedDayBackgroundColor: '#3F51B5',
    selectedDayTextColor: '#fff',
    todayTextColor: '#3F51B5',
    dayTextColor: isDarkMode ? '#eee' : '#333',
    arrowColor: isDarkMode ? '#fff' : '#3F51B5',
    monthTextColor: isDarkMode ? '#fff' : '#333',
    textDisabledColor: isDarkMode ? '#555' : '#ddd',
    indicatorColor: isDarkMode ? '#fff' : '#3F51B5',
    dotColor: '#3F51B5',
    selectedDotColor: '#ffffff',
    'stylesheet.calendar.header': {
      header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
      },
      monthText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: isDarkMode ? '#fff' : '#333'
      }
    }
  };

  return (
    <View style={styles.container}>
      {todos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay tareas programadas</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddTodo')}
          >
            <Text style={styles.addButtonText}>Agregar Primera Tarea</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <CalendarList
          horizontal
          pagingEnabled
          pastScrollRange={1}
          futureScrollRange={6}
          markedDates={markedDates}
          theme={calendarTheme}
          calendarWidth={400}
          onDayPress={handleDayPress}
          markingType="multi-dot"
          enableSwipeMonths={true}
          hideExtraDays={false}
          firstDay={1} // Lunes como primer día de la semana
        />
      )}
    </View>
  );
}
