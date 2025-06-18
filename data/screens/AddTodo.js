import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput,
  TouchableOpacity, Switch, Alert, ScrollView, FlatList
} from 'react-native';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, Feather } from '@expo/vector-icons';

export default function AddTodo() {
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [isToday, setIsToday] = useState(false);
  const [activities, setActivities] = useState([]);
  const [newActivity, setNewActivity] = useState('');

  const showTimePicker = () => {
    DateTimePickerAndroid.open({
      value: date,
      onChange: (event, selectedDate) => {
        if (selectedDate) setDate(selectedDate);
      },
      mode: 'time',
      is24Hour: true,
    });
  };

  const handleAddActivity = () => {
    if (!newActivity.trim()) return;
    setActivities([...activities, newActivity]);
    setNewActivity('');
  };

  const handleAddTodo = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Por favor ingresa un nombre de tarea.');
      return;
    }

    const todo = {
      name,
      description,
      time: `${date.getHours().toString().padStart(2, '0')}:${date
        .getMinutes()
        .toString()
        .padStart(2, '0')}`,
      isToday,
      activities,
    };

    navigation.navigate('Home', { todo });

    // Reset
    setName('');
    setDescription('');
    setIsToday(false);
    setDate(new Date());
    setActivities([]);
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={28} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>Nueva Tarea</Text>

      {/* Nombre */}
      <View style={styles.section}>
        <Text style={styles.label}>Título</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Comprar materiales"
          placeholderTextColor="#888"
          value={name}
          onChangeText={setName}
        />
      </View>

      {/* Descripción */}
      <View style={styles.section}>
        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
          placeholder="Detalles de la tarea..."
          placeholderTextColor="#888"
          multiline
          value={description}
          onChangeText={setDescription}
        />
      </View>

      {/* Hora */}
      <View style={styles.section}>
        <Text style={styles.label}>Hora</Text>
        <TouchableOpacity onPress={showTimePicker} style={styles.timeButton}>
          <Text style={styles.timeText}>
            {date.getHours().toString().padStart(2, '0')}:
            {date.getMinutes().toString().padStart(2, '0')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Hoy */}
      <View style={[styles.section, styles.switchRow]}>
        <Text style={styles.label}>¿Es para hoy?</Text>
        <Switch value={isToday} onValueChange={setIsToday} />
      </View>

      {/* Actividades */}
      <View style={styles.section}>
        <Text style={styles.label}>Actividades</Text>
        {activities.map((item, index) => (
          <Text key={index} style={styles.activityItem}>• {item}</Text>
        ))}
        <View style={styles.activityInputRow}>
          <TextInput
            style={styles.activityInput}
            placeholder="Nueva actividad..."
            placeholderTextColor="#888"
            value={newActivity}
            onChangeText={setNewActivity}
          />
          <TouchableOpacity onPress={handleAddActivity} style={styles.addButton}>
            <Feather name="plus" size={22} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Botón principal */}
      <TouchableOpacity onPress={handleAddTodo} style={styles.button}>
        <Text style={styles.buttonText}>Guardar Tarea</Text>
      </TouchableOpacity>

      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 20,
    backgroundColor: '#F9FAFB',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    padding: 10,
    zIndex: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
    color: '#111',
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    fontSize: 16,
  },
  timeButton: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#222',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  activityInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  addButton: {
    marginLeft: 10,
    backgroundColor: '#000',
    padding: 12,
    borderRadius: 10,
  },
  activityItem: {
    fontSize: 16,
    color: '#444',
    paddingVertical: 2,
  },
  button: {
    marginTop: 30,
    backgroundColor: '#000',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});
