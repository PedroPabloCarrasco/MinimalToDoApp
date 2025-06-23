// Archivo: AddExpense.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddExpense() {
  const navigation = useNavigation();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const saveExpense = async () => {
    if (!title.trim() || !amount.trim()) {
      Alert.alert('Error', 'Por favor ingresa un título y un monto válido.');
      return;
    }

    const numericAmount = Number(amount.replace(/\./g, ''));

    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert('Error', 'El monto debe ser un número positivo.');
      return;
    }

    try {
      const newExpense = {
        id: Date.now(),
        title: title.trim(),
        amount: numericAmount,
        date: date.toLocaleDateString('es-CL'),
      };

      const storedExpenses = await AsyncStorage.getItem('@expenses');
      const expenses = storedExpenses ? JSON.parse(storedExpenses) : [];

      expenses.push(newExpense);

      await AsyncStorage.setItem('@expenses', JSON.stringify(expenses));

      Alert.alert('¡Listo!', 'Gasto guardado exitosamente.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.log('Error guardando gasto:', error);
      Alert.alert('Error', 'No se pudo guardar el gasto.');
    }
  };

  const formatAmount = (text) => {
    const clean = text.replace(/\D/g, '');
    const number = Number(clean);
    return number.toLocaleString('es-CL');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.iconBackWrapper}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={28} color="#4CAF50" />
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Agregar Gasto</Text>
      </SafeAreaView>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Título</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Compra supermercado"
          value={title}
          onChangeText={setTitle}
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Monto</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: 25000"
          value={amount}
          onChangeText={(text) => setAmount(formatAmount(text))}
          keyboardType="numeric"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Fecha</Text>
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.datePickerText}>{date.toLocaleDateString('es-CL')}</Text>
          <Ionicons name="calendar-outline" size={22} color="#555" />
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
            locale="es-CL"
            maximumDate={new Date()}
          />
        )}
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={saveExpense}>
        <Text style={styles.saveButtonText}>Guardar Gasto</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  iconBackWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    paddingRight: 14,
  },
  backText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  formGroup: { marginBottom: 20 },
  label: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  datePickerText: {
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    marginTop: 30,
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    elevation: 4,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
});
