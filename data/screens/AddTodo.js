import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

export default function AddTodo() {
  const [name, setName] = React.useState('');
  const [date, setDate] = React.useState(new Date());
  const [isToday, setIsToday] = React.useState(false);

  const showTimePicker = () => {
    DateTimePickerAndroid.open({
      value: date,
      onChange: (event, selectedDate) => {
        if (selectedDate) {
          setDate(selectedDate);
        }
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

    // Aquí puedes manejar el envío de la tarea
    Alert.alert(
      'Tarea agregada',
      `Nombre: ${name}\nHora: ${date.getHours().toString().padStart(2, '0')}:${date
        .getMinutes()
        .toString()
        .padStart(2, '0')}\nHoy: ${isToday ? 'Sí' : 'No'}`
    );

    // Limpiar inputs
    setName('');
    setIsToday(false);
    setDate(new Date());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agregar tarea</Text>

      {/* Nombre */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>Nombre</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Tarea"
          placeholderTextColor="#00000030"
          onChangeText={setName}
          value={name}
        />
      </View>

      {/* Hora */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>Hora</Text>
        <TouchableOpacity onPress={showTimePicker} style={styles.timeButton}>
          <Text style={styles.timeText}>
            {date.getHours().toString().padStart(2, '0')}:
            {date.getMinutes().toString().padStart(2, '0')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Hoy */}
      <View style={styles.inputContainerRow}>
        <Text style={styles.inputTitle}>Hoy</Text>
        <Switch
          value={isToday}
          onValueChange={setIsToday}
          style={{ marginLeft: 10 }}
        />
      </View>

      {/* Botón */}
      <TouchableOpacity onPress={handleAddTodo} style={styles.button}>
        <Text style={styles.buttonText}>Done</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 30,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputContainerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  inputTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
  textInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#00000030',
    paddingVertical: 6,
    fontSize: 16,
  },
  timeButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#00000030',
    borderRadius: 5,
    marginTop: 5,
  },
  timeText: {
    fontSize: 16,
  },
  button: {
    marginTop: 30,
    backgroundColor: '#000000',
    height: 46,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
