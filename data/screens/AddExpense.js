// Archivo: data/screens/AddExpense.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function AddExpense() {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const navigation = useNavigation();

  const saveExpense = async () => {
    if (!description || !amount) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    const newExpense = {
      id: Date.now(),
      description,
      amount: parseFloat(amount),
    };

    try {
      const data = await AsyncStorage.getItem('@expenses_data');
      const existing = data ? JSON.parse(data) : [];
      const updated = [...existing, newExpense];
      await AsyncStorage.setItem('@expenses_data', JSON.stringify(updated));
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el gasto');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agregar Gasto</Text>

      <TextInput
        placeholder="Descripción"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <TextInput
        placeholder="Monto"
        value={amount}
        onChangeText={setAmount}
        style={styles.input}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.saveButton} onPress={saveExpense}>
        <Text style={styles.saveText}>Guardar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    backgroundColor: '#f2f2f2',
    padding: 14,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#3478F6',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
