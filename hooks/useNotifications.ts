import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Task } from '@/services/TaskService';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export function useNotifications() {
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  const registerForPushNotificationsAsync = async () => {
    if (Platform.OS === 'web') {
      return;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('Failed to get push token for push notification!');
      return;
    }
  };

  const scheduleNotification = async (task: Task) => {
    try {
      const trigger = new Date(task.dueDate);
      
      if (trigger <= new Date()) {
        console.warn('Cannot schedule notification for past date');
        return;
      }

      await Notifications.scheduleNotificationAsync({
        identifier: task.id,
        content: {
          title: '📋 Task Reminder',
          body: task.title,
          data: {
            taskId: task.id,
            task: task,
          },
          sound: true,
        },
        trigger,
      });

      console.log(`Notification scheduled for task: ${task.title} at ${trigger}`);
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  };

  const cancelNotification = async (taskId: string) => {
    try {
      await Notifications.cancelScheduledNotificationAsync(taskId);
      console.log(`Notification cancelled for task: ${taskId}`);
    } catch (error) {
      console.error('Error cancelling notification:', error);
    }
  };

  const scheduleSnoozeNotification = async (task: Task, minutes: number) => {
    try {
      // Cancel existing notification
      await cancelNotification(task.id);

      // Schedule new notification with snooze time
      const snoozeDate = new Date();
      snoozeDate.setMinutes(snoozeDate.getMinutes() + minutes);

      await Notifications.scheduleNotificationAsync({
        identifier: `${task.id}_snooze`,
        content: {
          title: '🔔 Snoozed Reminder',
          body: task.title,
          data: {
            taskId: task.id,
            task: task,
          },
          sound: true,
        },
        trigger: snoozeDate,
      });

      console.log(`Notification snoozed for ${minutes} minutes`);
    } catch (error) {
      console.error('Error snoozing notification:', error);
    }
  };

  return {
    scheduleNotification,
    cancelNotification,
    scheduleSnoozeNotification,
  };
}