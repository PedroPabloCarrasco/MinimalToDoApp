// components/TaskCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TaskCard = ({ todo, onToggle, onDelete, customColor }) => {
  return (
    <View style={[styles.card, { borderLeftColor: getColor(todo.priority) }]}>
      <TouchableOpacity onPress={onToggle} style={styles.content}>
        <View style={styles.header}>
          <Text
            style={[
              styles.title,
              todo.isCompleted && { textDecorationLine: 'line-through', opacity: 0.6 },
            ]}
            numberOfLines={1}
          >
            {todo.title}
          </Text>
          <Ionicons
            name={todo.isCompleted ? 'checkmark-circle' : 'ellipse-outline'}
            size={22}
            color={todo.isCompleted ? customColor : '#ccc'}
          />
        </View>
        {todo.description && (
          <Text style={styles.desc} numberOfLines={2}>
            {todo.description}
          </Text>
        )}
        <Text style={styles.time}>
          🕒 {new Date(todo.dueDate).toLocaleTimeString().slice(0, 5)}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onDelete} style={styles.trash}>
        <Ionicons name="trash-outline" size={20} color="#FF5252" />
      </TouchableOpacity>
    </View>
  );
};

const getColor = (priority) => {
  switch (priority) {
    case 'high':
      return '#FF5252';
    case 'medium':
      return '#FFC107';
    case 'low':
      return '#4CAF50';
    default:
      return '#999';
  }
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 12,
    padding: 12,
    borderLeftWidth: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 2,
  },
  content: {
    flex: 1,
    paddingRight: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 6,
  },
  desc: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  time: {
    marginTop: 4,
    fontSize: 13,
    color: '#999',
  },
  trash: {
    justifyContent: 'center',
    paddingLeft: 8,
  },
});

export default TaskCard;
