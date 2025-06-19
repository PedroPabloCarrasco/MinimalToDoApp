import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format, isToday } from 'date-fns';
import { es } from 'date-fns/locale';
import Icon from 'react-native-vector-icons/Ionicons';

export default function AddTodo({ navigation, route, addTodo }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(route.params?.selectedDate || new Date());
  const [priority, setPriority] = useState('medium');
  const [showPriorityModal, setShowPriorityModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerMode, setPickerMode] = useState(null);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const showPicker = (mode) => {
    setPickerMode(mode);
    setShowDatePicker(true);
  };

  const handleAddTodo = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Por favor ingresa un nombre para la tarea');
      return;
    }

    const newTodo = {
      id: Date.now().toString(),
      title: name,
      description,
      dueDate: date.toISOString(),
      priority,
      isCompleted: false,
      isToday: isToday(date),
    };

    addTodo(newTodo);

    Alert.alert(
      'Tarea creada',
      `Título: ${name}\nPrioridad: ${getPriorityLabel(priority)}\nFecha: ${format(date, 'PPpp', { locale: es })}`
    );

    navigation.goBack();
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Baja';
      default: return 'Media';
    }
  };

  const PriorityOption = ({ level, label }) => (
    <TouchableOpacity
      style={[styles.priorityOption, priority === level && styles[`${level}PriorityActive`]]}
      onPress={() => {
        setPriority(level);
        setShowPriorityModal(false);
      }}
    >
      <View style={[styles.priorityDot, styles[`${level}Priority`]]} />
      <Text style={styles.priorityText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back-circle" size={36} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Nueva Tarea</Text>
        <View style={{ width: 36 }} /> {/* Espacio para centrar título */}
      </View>

      {/* Nombre */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>Título*</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Nombre de la tarea"
          placeholderTextColor="#00000030"
          onChangeText={setName}
          value={name}
          returnKeyType="next"
          maxLength={50}
        />
      </View>

      {/* Descripción */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>Descripción</Text>
        <TextInput
          style={[styles.textInput, styles.multilineInput]}
          placeholder="Detalles de la tarea (opcional)"
          placeholderTextColor="#00000030"
          onChangeText={setDescription}
          value={description}
          multiline
          numberOfLines={3}
          maxLength={200}
        />
      </View>

      {/* Fecha */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>Fecha</Text>
        <TouchableOpacity onPress={() => showPicker('date')} style={styles.dateTimeButton} activeOpacity={0.7}>
          <Text style={styles.dateTimeText}>
            {format(date, "EEEE, d 'de' MMMM", { locale: es })}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Hora */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>Hora</Text>
        <TouchableOpacity onPress={() => showPicker('time')} style={styles.dateTimeButton} activeOpacity={0.7}>
          <Text style={styles.dateTimeText}>
            {format(date, 'HH:mm', { locale: es })}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Prioridad */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>Prioridad</Text>
        <TouchableOpacity onPress={() => setShowPriorityModal(true)} style={styles.dateTimeButton} activeOpacity={0.7}>
          <Text style={styles.dateTimeText}>{getPriorityLabel(priority)}</Text>
        </TouchableOpacity>
      </View>

      {/* Botón */}
      <TouchableOpacity
        onPress={handleAddTodo}
        style={[styles.button, !name.trim() && styles.disabledButton]}
        disabled={!name.trim()}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Crear Tarea</Text>
      </TouchableOpacity>

      {/* Modal de Prioridad */}
      <Modal visible={showPriorityModal} transparent animationType="slide" onRequestClose={() => setShowPriorityModal(false)}>
        <TouchableWithoutFeedback onPress={() => setShowPriorityModal(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>

        <View style={styles.modalContent}>
          <PriorityOption level="high" label="Alta Prioridad" />
          <PriorityOption level="medium" label="Media Prioridad" />
          <PriorityOption level="low" label="Baja Prioridad" />
        </View>
      </Modal>

      {/* DatePicker para iOS y Android */}
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode={pickerMode}
          display={pickerMode === 'date' ? 'inline' : 'spinner'}
          onChange={handleDateChange}
          minimumDate={new Date()}
          locale="es-ES"
          is24Hour
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 25,
    paddingBottom: 40,
    backgroundColor: 'white',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 25,
  },
  inputTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  textInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 8,
    fontSize: 16,
    color: '#333',
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
  },
  dateTimeButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 14,
    backgroundColor: '#f9f9f9',
  },
  dateTimeText: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#000',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#aaa',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  priorityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  priorityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  priorityText: {
    fontSize: 16,
    color: '#333',
  },
  highPriority: { backgroundColor: '#FF5252' },
  mediumPriority: { backgroundColor: '#FFC107' },
  lowPriority: { backgroundColor: '#4CAF50' },
  highPriorityActive: { backgroundColor: '#FFF6F6' },
  mediumPriorityActive: { backgroundColor: '#FFFBF2' },
  lowPriorityActive: { backgroundColor: '#F6FFF6' },
});
