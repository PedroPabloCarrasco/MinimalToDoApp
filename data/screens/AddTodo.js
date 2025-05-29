import * as React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';

export default function AddTodo() {
  const [name, setName] = React.useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agregar tarea</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>Nombre</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Tarea"
          placeholderTextColor="#00000030"
          onChangeText={(text) => setName(text)}
          value={name}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  inputContainer: {
    width: '80%',
  },
  inputTitle: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 24,
    marginBottom: 10,
  },
  textInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#00000030',
    paddingVertical: 5,
  },
});
