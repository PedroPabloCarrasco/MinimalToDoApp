import React, { useEffect, useState, useRef } from 'react';
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
  Animated,
  Easing,
  useColorScheme,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const STORAGE_KEY = '@APP_DARK_MODE';

export default function Finance() {
  const navigation = useNavigation();
  const systemColorScheme = useColorScheme();

  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');
  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);
  const [budget, setBudget] = useState(0);
  const [isBudgetModalVisible, setIsBudgetModalVisible] = useState(false);
  const [budgetInput, setBudgetInput] = useState('');

  // Animaciones totales
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  // Animación botón agregar - escala suave onPress
  const addBtnScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(value => {
      if (value !== null) {
        setIsDarkMode(value === 'true');
      }
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, isDarkMode.toString());
  }, [isDarkMode]);

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

  // Animar totales cada vez que cambian
  useEffect(() => {
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.9);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  }, [total, budget]);

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

  // Componente gasto con animación fade + slide desde abajo
  const ExpenseItem = ({ item, index }) => {
    const slideAnim = useRef(new Animated.Value(20)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          delay: index * 100,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 400,
          delay: index * 100,
          useNativeDriver: true,
        }),
      ]).start();
    }, []);

    return (
      <Animated.View
        style={[
          isDarkMode ? darkStyles.expenseItem : lightStyles.expenseItem,
          {
            opacity: opacityAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={{ flex: 1 }}>
          <Text style={isDarkMode ? darkStyles.expenseTitle : lightStyles.expenseTitle}>{item.title}</Text>
          <Text style={isDarkMode ? darkStyles.expenseDate : lightStyles.expenseDate}>{item.date}</Text>
        </View>
        <Text style={isDarkMode ? darkStyles.expenseAmount : lightStyles.expenseAmount}>{formatCLP(item.amount)}</Text>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <Ionicons name="trash-outline" size={22} color="#e53935" />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderItem = ({ item, index }) => <ExpenseItem item={item} index={index} />;

  const remaining = budget - total;

  return (
    <View style={isDarkMode ? darkStyles.container : lightStyles.container}>
      <SafeAreaView style={isDarkMode ? darkStyles.headerContainer : lightStyles.headerContainer}>
        <TouchableOpacity
          style={isDarkMode ? darkStyles.iconBackWrapper : lightStyles.iconBackWrapper}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={28} color={isDarkMode ? '#81C784' : '#4CAF50'} />
          <Text style={isDarkMode ? darkStyles.backText : lightStyles.backText}>Volver</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={openBudgetModal}>
          <Ionicons name="wallet-outline" size={24} color={isDarkMode ? '#81C784' : '#4CAF50'} />
        </TouchableOpacity>
      </SafeAreaView>

      <Text style={isDarkMode ? darkStyles.headerTitle : lightStyles.headerTitle}>Resumen Financiero</Text>

      <Animated.View
        style={[
          isDarkMode ? darkStyles.totalBox : lightStyles.totalBox,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={isDarkMode ? darkStyles.totalText : lightStyles.totalText}>Presupuesto:</Text>
        <Text style={isDarkMode ? darkStyles.totalAmount : lightStyles.totalAmount}>{formatCLP(budget)}</Text>

        <Text style={[isDarkMode ? darkStyles.totalText : lightStyles.totalText, { marginTop: 16 }]}>Gastos Totales:</Text>
        <Text style={isDarkMode ? darkStyles.totalAmountRed : lightStyles.totalAmountRed}>{formatCLP(total)}</Text>

        <Text style={[isDarkMode ? darkStyles.totalText : lightStyles.totalText, { marginTop: 16 }]}>Saldo Restante:</Text>
        <Text
          style={[
            isDarkMode ? darkStyles.totalAmount : lightStyles.totalAmount,
            { color: remaining < 0 ? '#e53935' : '#2e7d32' },
          ]}
        >
          {formatCLP(remaining)}
        </Text>
      </Animated.View>

      <FlatList
        data={[...expenses].reverse()}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 30 }}
      />

      <TouchableOpacity
        style={isDarkMode ? darkStyles.addButton : lightStyles.addButton}
        activeOpacity={0.8}
        onPressIn={() => {
          Animated.spring(addBtnScale, { toValue: 0.95, useNativeDriver: true }).start();
        }}
        onPressOut={() => {
          Animated.spring(addBtnScale, { toValue: 1, friction: 3, tension: 40, useNativeDriver: true }).start();
        }}
        onPress={() => navigation.navigate('AddExpense')}
      >
        <Animated.View style={{ transform: [{ scale: addBtnScale }] }}>
          <Text style={isDarkMode ? darkStyles.addButtonText : lightStyles.addButtonText}>+ Agregar Gasto</Text>
        </Animated.View>
      </TouchableOpacity>

      {/* Modal para ingresar presupuesto */}
      <Modal
        visible={isBudgetModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsBudgetModalVisible(false)}
      >
        <View style={isDarkMode ? darkStyles.modalOverlay : lightStyles.modalOverlay}>
          <View style={isDarkMode ? darkStyles.modalContainer : lightStyles.modalContainer}>
            <Text style={isDarkMode ? darkStyles.modalTitle : lightStyles.modalTitle}>Establecer Presupuesto</Text>
            <TextInput
              style={isDarkMode ? darkStyles.modalInput : lightStyles.modalInput}
              keyboardType="numeric"
              value={budgetInput}
              onChangeText={setBudgetInput}
              placeholder="Ingresa tu presupuesto mensual"
              placeholderTextColor={isDarkMode ? '#999' : '#888'}
              maxLength={10}
            />
            <View style={isDarkMode ? darkStyles.modalButtons : lightStyles.modalButtons}>
              <Pressable
                style={[isDarkMode ? darkStyles.modalButton : lightStyles.modalButton, { backgroundColor: '#e53935' }]}
                onPress={() => setIsBudgetModalVisible(false)}
              >
                <Text style={isDarkMode ? darkStyles.modalButtonText : lightStyles.modalButtonText}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={[isDarkMode ? darkStyles.modalButton : lightStyles.modalButton, { backgroundColor: '#4CAF50' }]}
                onPress={saveBudget}
              >
                <Text style={isDarkMode ? darkStyles.modalButtonText : lightStyles.modalButtonText}>Guardar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const baseStyles = {
  container: { flex: 1, padding: 20 },
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
    fontWeight: '600',
    marginLeft: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  totalBox: {
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  totalText: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 4,
  },
  totalAmountRed: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 4,
  },
  expenseItem: {
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
  },
  expenseDate: {
    fontSize: 13,
    marginTop: 4,
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: '700',
    marginRight: 6,
  },
  addButton: {
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 50,
  },
  addButtonText: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 0,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
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
};

const lightStyles = StyleSheet.create({
  ...baseStyles,
  container: { ...baseStyles.container, backgroundColor: '#fff' },
  backText: { ...baseStyles.backText, color: '#4CAF50' },
  headerTitle: { ...baseStyles.headerTitle, color: '#333' },
  totalBox: { ...baseStyles.totalBox, backgroundColor: '#e0f2f1' },
  totalText: { ...baseStyles.totalText, color: '#333' },
  totalAmount: { ...baseStyles.totalAmount, color: '#2e7d32' },
  totalAmountRed: { ...baseStyles.totalAmountRed, color: '#e53935' },
  expenseItem: { ...baseStyles.expenseItem, backgroundColor: '#f5f5f5' },
  expenseTitle: { ...baseStyles.expenseTitle, color: '#333' },
  expenseDate: { ...baseStyles.expenseDate, color: '#888' },
  expenseAmount: { ...baseStyles.expenseAmount, color: '#e53935' },
  addButton: { ...baseStyles.addButton, backgroundColor: '#4CAF50' },
  addButtonText: { ...baseStyles.addButtonText, color: '#fff' },
  modalOverlay: { ...baseStyles.modalOverlay, backgroundColor: '#000000aa' },
  modalContainer: { ...baseStyles.modalContainer, backgroundColor: '#fff' },
  modalTitle: { ...baseStyles.modalTitle, color: '#333' },
  modalInput: { ...baseStyles.modalInput, borderColor: '#ccc', color: '#000' },
  modalButtons: { ...baseStyles.modalButtons },
  modalButton: { ...baseStyles.modalButton },
  modalButtonText: { ...baseStyles.modalButtonText },
});

const darkStyles = StyleSheet.create({
  ...baseStyles,
  container: { ...baseStyles.container, backgroundColor: '#121212' },
  backText: { ...baseStyles.backText, color: '#81C784' },
  headerTitle: { ...baseStyles.headerTitle, color: '#eee' },
  totalBox: { ...baseStyles.totalBox, backgroundColor: '#333' },
  totalText: { ...baseStyles.totalText, color: '#eee' },
  totalAmount: { ...baseStyles.totalAmount, color: '#81C784' },
  totalAmountRed: { ...baseStyles.totalAmountRed, color: '#e57373' },
  expenseItem: { ...baseStyles.expenseItem, backgroundColor: '#222' },
  expenseTitle: { ...baseStyles.expenseTitle, color: '#eee' },
  expenseDate: { ...baseStyles.expenseDate, color: '#bbb' },
  expenseAmount: { ...baseStyles.expenseAmount, color: '#e57373' },
  addButton: { ...baseStyles.addButton, backgroundColor: '#81C784' },
  addButtonText: { ...baseStyles.addButtonText, color: '#121212' },
  modalOverlay: { ...baseStyles.modalOverlay, backgroundColor: '#000000cc' },
  modalContainer: { ...baseStyles.modalContainer, backgroundColor: '#222' },
  modalTitle: { ...baseStyles.modalTitle, color: '#eee' },
  modalInput: { ...baseStyles.modalInput, borderColor: '#555', color: '#eee' },
  modalButtons: { ...baseStyles.modalButtons },
  modalButton: { ...baseStyles.modalButton },
  modalButtonText: { ...baseStyles.modalButtonText },
});
