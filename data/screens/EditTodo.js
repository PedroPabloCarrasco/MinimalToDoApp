import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Switch, Alert
} from 'react-native';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function EditTodo() {
  const navigation = useNavigation();
  const route = useRoute();
  const { todo, index, onUpdate } = route.params;

  const [name, setName] = useState(todo.name);
  const [description, setDescription] = useState(todo.description || '');
  const [date, setDate] = useState(new Date());
  const [isToday, setIsToday] = useState(todo.isToday);
  const [priority, setPriority] = useState(todo.priority || 'Media');

  useEffect(() => {
    if (todo.date) {
      // Convierte la fecha 'dd/mm/yyyy' a objeto Date para el picker
      const parts = todo.date.split('/');
      const d = new Date(parts[2], parts[1] - 1, parts[0], ...todo.time.split(':'));
      setDate(d);
    }
  }, []);

  const showDatePicker = () => {
    DateTimePickerAndroid.open({
      value: date,
      onChange: (_, selectedDate) => {
        if (selectedDate) setDate(selectedDate);
      },
      mode: 'date',
    });
  };

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

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'El nombre es obligatorio.');
      return;
    }

    const formattedDate = date.toLocaleDateString();
    const formattedTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

    const updatedTodo = {
      name,
      description,
      date: formattedDate,
      time: formattedTime,
      isToday,
      priority,
    };

    onUpdate(index, updatedTodo);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Botón regresar */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>Editar tarea</Text>

      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
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

      <TouchableOpacity onPress={handleSave} style={styles.button}>
        <Text style={styles.buttonText}>Guardar cambios</Text>
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
  dateText: {
    fontSize: 16,
  },

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
    borderRadius: 10, alignItems: 'center'
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
