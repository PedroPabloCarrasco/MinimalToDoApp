// Archivo: data/screens/Finance.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function Finance() {
  const [expenses, setExpenses] = useState([]);
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  useEffect(() => {
    if (isFocused) loadExpenses();
  }, [isFocused]);

  const loadExpenses = async () => {
    try {
      const data = await AsyncStorage.getItem('@expenses_data');
      setExpenses(data ? JSON.parse(data) : []);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los gastos');
    }
  };

  const getTotal = () => {
    return expenses.reduce((acc, item) => acc + item.amount, 0);
  };

  const renderItem = ({ item }) => (
    <View style={styles.expenseItem}>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.amount}>${item.amount.toLocaleString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resumen de Gastos</Text>

      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={<Text style={styles.empty}>Sin gastos aún.</Text>}
      />

      <View style={styles.totalBox}>
        <Text style={styles.totalText}>Total:</Text>
        <Text style={styles.totalAmount}>${getTotal().toLocaleString()}</Text>
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddExpense')}
      >
        <Ionicons name="add" size={28} color="#fff" />
        <Text style={styles.addText}>Agregar gasto</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  expenseItem: {
    backgroundColor: '#f2f2f2',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  description: { fontSize: 16, color: '#555' },
  amount: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  empty: { textAlign: 'center', color: '#888', marginTop: 20 },
  totalBox: {
    backgroundColor: '#eee',
    padding: 16,
    borderRadius: 10,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalText: { fontSize: 18, fontWeight: '600' },
  totalAmount: { fontSize: 18, fontWeight: '700', color: '#000' },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#3478F6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
  },
  addText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 8,
  },
});
