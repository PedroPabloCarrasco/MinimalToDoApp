import React from 'react';
import { View, StyleSheet } from 'react-native';

export const PriorityIndicator = ({ priority }) => {
  let color;
  
  switch (priority) {
    case 'high':
      color = '#FF5252';
      break;
    case 'medium':
      color = '#FFC107';
      break;
    case 'low':
      color = '#4CAF50';
      break;
    default:
      color = '#9E9E9E';
  }

  return (
    <View style={[styles.priorityIndicator, { backgroundColor: color }]} />
  );
};

const styles = StyleSheet.create({
  priorityIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
});
