// components/ProgressBar.js
import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function ProgressBar({ progress = 0, isDarkMode = false }) {
  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <View
        style={[
          styles.bar,
          { width: `${progress * 100}%` },
          isDarkMode ? styles.darkBar : styles.lightBar,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#e0e0e0',
    overflow: 'hidden',
    marginTop: 10,
  },
  bar: {
    height: '100%',
    borderRadius: 5,
  },
  lightBar: {
    backgroundColor: '#4CAF50',
  },
  darkContainer: {
    backgroundColor: '#444',
  },
  darkBar: {
    backgroundColor: '#81C784',
  },
});
