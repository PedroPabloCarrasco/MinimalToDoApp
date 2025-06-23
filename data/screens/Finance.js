// Archivo: Finance.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  Pressable,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Finance() {
  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);
  const [budget, setBudget] = useState(0);
  const [isBudgetModalVisible, setIsBudgetModalVisible] = useState(false);
  const [budgetInput, setBudgetInput] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedExpenses = await AsyncStorage.getItem('@expenses');
        const storedBudget = await AsyncStorage.getItem('@budget');
        const parsedExpenses = storedExpenses ? JSON.parse(storedExpenses) : [];
        const parsedBudget = storedBudget ? Number(storedBudget) : 0;

        setExpenses(parsedExpenses);
        updateTotal(parsedExpenses);
        setBudget(parsedBudget);
        setBudgetInput(parsedBudget.toString());
      } catch (e) {
        console.log('Error al cargar datos:', e);
      }
    };

    const unsubscribe = navigation.addListener('focus', fetchData);
    return unsubscribe;
  }, [navigation]);

  const updateTotal = (list) => {
    const sum = list.reduce((acc, e) => acc + Number(e.amount), 0);
    setTotal(sum);
  };

  const formatCLP = (num) =>
    Number(num).toLocaleString('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    });

  const handleDelete = (id) => {
    Alert.alert('Eliminar', '¿Estás seguro de eliminar este gasto?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            const filtered = expenses.filter((e) => e.id !== id);
            await AsyncStorage.setItem('@expenses', JSON.stringify(filtered));
            setExpenses(filtered);
            updateTotal(filtered);
          } catch (e) {
            console.log('Error al eliminar gasto:', e);
          }
        },
      },
    ]);
  };

  const openBudgetModal = () => {
    setBudgetInput(budget.toString());
    setIsBudgetModalVisible(true);
  };

  const saveBudget = async () => {
    const numeric = Number(budgetInput.replace(/\D/g, ''));
    if (!isNaN(numeric) && numeric > 0) {
      setBudget(numeric);
      await AsyncStorage.setItem('@budget', numeric.toString());
      setIsBudgetModalVisible(false);
    } else {
      Alert.alert('Error', 'Ingresa un número válido mayor que cero.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.expenseItem}>
      <View style={{ flex: 1 }}>
        <Text style={styles.expenseTitle}>{item.title}</Text>
        <Text style={styles.expenseDate}>{item.date}</Text>
      </View>
      <Text style={styles.expenseAmount}>{formatCLP(item.amount)}</Text>
      <TouchableOpacity onPress={() => handleDelete(item.id)}>
        <Ionicons name="trash-outline" size={22} color="#e53935" />
      </TouchableOpacity>
    </View>
  );

  const remaining = budget - total;

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.iconBackWrapper}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={28} color="#4CAF50" />
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={openBudgetModal}>
          <Ionicons name="wallet-outline" size={24} color="#4CAF50" />
        </TouchableOpacity>
      </SafeAreaView>

      <Text style={styles.headerTitle}>Resumen Financiero</Text>

      <View style={styles.totalBox}>
        <Text style={styles.totalText}>Presupuesto:</Text>
        <Text style={styles.totalAmount}>{formatCLP(budget)}</Text>

        <Text style={[styles.totalText, { marginTop: 16 }]}>Gastos Totales:</Text>
        <Text style={styles.totalAmountRed}>{formatCLP(total)}</Text>

        <Text style={[styles.totalText, { marginTop: 16 }]}>Saldo Restante:</Text>
        <Text
          style={[
            styles.totalAmount,
            { color: remaining < 0 ? '#e53935' : '#2e7d32' },
          ]}
        >
          {formatCLP(remaining)}
        </Text>
      </View>

      <FlatList
        data={[...expenses].reverse()}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 30 }}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddExpense')}
      >
        <Text style={styles.addButtonText}>+ Agregar Gasto</Text>
      </TouchableOpacity>

      {/* Modal para ingresar presupuesto */}
      <Modal
        visible={isBudgetModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsBudgetModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Establecer Presupuesto</Text>
            <TextInput
              style={styles.modalInput}
              keyboardType="numeric"
              value={budgetInput}
              onChangeText={setBudgetInput}
              placeholder="Ingresa tu presupuesto mensual"
              maxLength={10}
            />
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, { backgroundColor: '#e53935' }]}
                onPress={() => setIsBudgetModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, { backgroundColor: '#4CAF50' }]}
                onPress={saveBudget}
              >
                <Text style={styles.modalButtonText}>Guardar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  iconBackWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  backText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
    marginLeft: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  totalBox: {
    backgroundColor: '#e0f2f1',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  totalText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginTop: 4,
  },
  totalAmountRed: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#e53935',
    marginTop: 4,
  },
  expenseItem: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  expenseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  expenseDate: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#e53935',
    marginRight: 6,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 50,
  },
  addButtonText: {
    marginBottom: '20px',
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 25,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
