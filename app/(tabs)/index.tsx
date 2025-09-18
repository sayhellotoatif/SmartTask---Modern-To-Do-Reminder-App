import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { ChevronDown, Filter, Import as SortAsc } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useNotifications } from '@/hooks/useNotifications';
import { TaskCard } from '@/components/TaskCard';
import { SortModal } from '@/components/SortModal';
import { TaskService, Task } from '@/services/TaskService';

export default function TasksScreen() {
  const { colors, isDark } = useTheme();
  const { scheduleNotification, cancelNotification } = useNotifications();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'alphabetical'>('date');

  const loadTasks = useCallback(async () => {
    try {
      const allTasks = await TaskService.getAllTasks();
      const sortedTasks = sortTasks(allTasks, sortBy);
      setTasks(sortedTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
      Alert.alert('Error', 'Failed to load tasks');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [sortBy]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const sortTasks = (tasks: Task[], sortBy: string) => {
    const tasksCopy = [...tasks];
    switch (sortBy) {
      case 'date':
        return tasksCopy.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
      case 'priority':
        const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
        return tasksCopy.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
      case 'alphabetical':
        return tasksCopy.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return tasksCopy;
    }
  };

  const handleTaskComplete = async (taskId: string, completed: boolean) => {
    try {
      await TaskService.updateTask(taskId, { isCompleted: completed });
      if (completed) {
        await cancelNotification(taskId);
      } else {
        const task = tasks.find(t => t.id === taskId);
        if (task && new Date(task.dueDate) > new Date()) {
          await scheduleNotification(task);
        }
      }
      loadTasks();
    } catch (error) {
      console.error('Error updating task:', error);
      Alert.alert('Error', 'Failed to update task');
    }
  };

  const handleTaskDelete = async (taskId: string) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await TaskService.deleteTask(taskId);
              await cancelNotification(taskId);
              loadTasks();
            } catch (error) {
              console.error('Error deleting task:', error);
              Alert.alert('Error', 'Failed to delete task');
            }
          },
        },
      ]
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadTasks();
  };

  const handleSortChange = (newSortBy: 'date' | 'priority' | 'alphabetical') => {
    setSortBy(newSortBy);
    setShowSortModal(false);
  };

  const getSortLabel = () => {
    switch (sortBy) {
      case 'date': return 'Due Date';
      case 'priority': return 'Priority';
      case 'alphabetical': return 'A-Z';
      default: return 'Due Date';
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={[styles.title, { color: colors.text }]}>My Tasks</Text>
      <TouchableOpacity
        style={[styles.sortButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
        onPress={() => setShowSortModal(true)}
        activeOpacity={0.7}
      >
        <SortAsc size={16} color={colors.primary} />
        <Text style={[styles.sortButtonText, { color: colors.primary }]}>{getSortLabel()}</Text>
        <ChevronDown size={14} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
        No tasks yet. Tap the "+" to create your first task!
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {renderHeader()}
      
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onComplete={handleTaskComplete}
            onDelete={handleTaskDelete}
          />
        )}
        contentContainerStyle={tasks.length === 0 ? styles.emptyContainer : styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={renderEmptyState}
      />

      {showSortModal && (
        <BlurView intensity={80} tint={isDark ? 'dark' : 'light'} style={styles.modalOverlay}>
          <SortModal
            currentSort={sortBy}
            onSortChange={handleSortChange}
            onClose={() => setShowSortModal(false)}
          />
        </BlurView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    gap: 6,
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyState: {
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});