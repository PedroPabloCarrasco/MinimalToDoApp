import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput,
  TouchableOpacity, Switch, Alert
} from 'react-native';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';

export default function AddTodo({ onAdd }) {
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [isToday, setIsToday] = useState(false);
  const [priority, setPriority] = useState('Media');

  // Mostrar selector fecha
  const showDatePicker = () => {
    DateTimePickerAndroid.open({
      value: date,
      onChange: (_, selectedDate) => {
        if (selectedDate) setDate(selectedDate);
      },
      mode: 'date',
    });
  };

  // Mostrar selector hora
  const showTimePicker = () => {
    DateTimePickerAndroid.open({
      value: date,
      onChange: (_, selectedDate) => {
        if (selectedDate) setDate(selectedDate);
      },
      mode: 'time',
      is24Hour: true,
    });
  };

  const handleAddTodo = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Por favor ingresa un nombre de tarea.');
      return;
    }

    const formattedDate = date.toLocaleDateString();
    const formattedTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

    const todo = {
      name,
      description,
      date: formattedDate,
      time: formattedTime,
      isToday,
      priority,
    };

    onAdd(todo);
    navigation.navigate('Tasks');
  };

  const handleTestNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🔔 Notificación de prueba",
        body: "Esto es una notificación local de prueba.",
      },
      trigger: null, // se muestra inmediatamente
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>Agregar tarea</Text>

      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: Comprar leche"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Ej: Ir al supermercado y comprar productos"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Text style={styles.label}>Fecha</Text>
      <TouchableOpacity onPress={showDatePicker} style={styles.dateButton}>
        <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Hora</Text>
      <TouchableOpacity onPress={showTimePicker} style={styles.timeButton}>
        <Text style={styles.timeText}>
          {date.getHours().toString().padStart(2, '0')}:
          {date.getMinutes().toString().padStart(2, '0')}
        </Text>
      </TouchableOpacity>

      <View style={styles.switchRow}>
        <Text style={styles.label}>¿Es para hoy?</Text>
        <Switch value={isToday} onValueChange={setIsToday} />
      </View>

      <Text style={styles.label}>Prioridad</Text>
      <View style={styles.priorityRow}>
        {['Alta', 'Media', 'Baja'].map((level) => (
          <TouchableOpacity
            key={level}
            onPress={() => setPriority(level)}
            style={[
              styles.priorityOption,
              priority === level && styles.selectedPriority
            ]}
          >
            <Text style={{ color: priority === level ? '#fff' : '#333' }}>{level}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity onPress={handleAddTodo} style={styles.button}>
        <Text style={styles.buttonText}>Guardar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleTestNotification} style={styles.testButton}>
        <Text style={styles.testButtonText}>🔔 Probar notificación</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 20, backgroundColor: '#fff' },
  backButton: { position: 'absolute', top: 40, left: 20, padding: 10 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },

  label: { fontSize: 16, fontWeight: '600', marginBottom: 6 },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 10,
    padding: 12, fontSize: 16, marginBottom: 15
  },

  dateButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  dateText: { fontSize: 16 },

  timeButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  timeText: { fontSize: 16 },

  switchRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 20
  },

  priorityRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  priorityOption: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 8, backgroundColor: '#eee',
  },
  selectedPriority: { backgroundColor: '#000' },

  button: {
    backgroundColor: '#000', padding: 14,
    borderRadius: 10, alignItems: 'center', marginBottom: 10
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },

  testButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  testButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
