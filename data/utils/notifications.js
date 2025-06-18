// notifications.js
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import { Platform } from 'react-native';

export async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    alert('Permiso de notificaciones rechazado');
    return false;
  }

  return true;
}

export function scheduleTodoNotification(todo) {
  // fecha con hora límite
  const trigger = new Date(todo.dateTime); 

  // si la fecha ya pasó, no programar
  if (trigger <= new Date()) return;

  Notifications.scheduleNotificationAsync({
    content: {
      title: `Recordatorio: ${todo.name}`,
      body: todo.description || 'Tienes una tarea pendiente',
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger,
  });
}
