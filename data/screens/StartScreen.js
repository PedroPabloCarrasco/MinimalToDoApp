// Archivo: data/screens/StartScreen.js

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function StartScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerTop}>
        <Text style={styles.appTitle}>Yuno</Text>
        <Text style={styles.subtitle}>Organiza tus tareas. Controla tus finanzas. Todo en un solo lugar.</Text>
      </View>

      <View style={styles.content}>
        

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Home')}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>Comenzar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}










const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdfdfd',
    padding: 24,
    justifyContent: 'center',
  },
  headerTop: {
    alignItems: 'center',
    marginBottom: 20,
  },
  appTitle: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#3478F6',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#777',
    fontWeight: '500',
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    marginVertical: 20,
  },
  content: {
    alignItems: 'center',
  },
  slogan: {
    fontSize: 16,
    textAlign: 'center',
    color: '#444',
    marginBottom: 40,
    lineHeight: 24,
    fontWeight: '400',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
