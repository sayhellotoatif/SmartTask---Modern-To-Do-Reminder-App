import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SquareCheck as CheckSquare, Square, Trash2, Calendar, Flag } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Task, Priority } from '@/services/TaskService';

interface TaskCardProps {
  task: Task;
  onComplete: (taskId: string, completed: boolean) => void;
  onDelete: (taskId: string) => void;
}

export function TaskCard({ task, onComplete, onDelete }: TaskCardProps) {
  const { colors } = useTheme();

  const formatDueDate = (date: string) => {
    const dueDate = new Date(date);
    const now = new Date();
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    if (diffDays <= 7) return `In ${diffDays} days`;
    
    return dueDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'High': return '#DC2626';
      case 'Medium': return '#D97706';
      case 'Low': return '#059669';
      default: return colors.textSecondary;
    }
  };

  const isOverdue = new Date(task.dueDate) < new Date() && !task.isCompleted;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: isOverdue ? '#DC2626' : colors.border,
          borderWidth: isOverdue ? 2 : 1,
        },
        task.isCompleted && { opacity: 0.6 },
      ]}
    >
      {/* Header Row */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => onComplete(task.id, !task.isCompleted)}
          activeOpacity={0.7}
        >
          {task.isCompleted ? (
            <CheckSquare size={24} color={colors.primary} />
          ) : (
            <Square size={24} color={colors.textSecondary} />
          )}
        </TouchableOpacity>

        <View style={styles.taskInfo}>
          <Text
            style={[
              styles.title,
              { color: colors.text },
              task.isCompleted && styles.completedTitle,
            ]}
            numberOfLines={2}
          >
            {task.title}
          </Text>

          {task.description ? (
            <Text
              style={[styles.description, { color: colors.textSecondary }]}
              numberOfLines={2}
            >
              {task.description}
            </Text>
          ) : null}
        </View>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete(task.id)}
          activeOpacity={0.7}
        >
          <Trash2 size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Footer Row */}
      <View style={styles.footer}>
        <View style={styles.dueDateContainer}>
          <Calendar size={14} color={isOverdue ? '#DC2626' : colors.textSecondary} />
          <Text
            style={[
              styles.dueDate,
              { color: isOverdue ? '#DC2626' : colors.textSecondary },
            ]}
          >
            {formatDueDate(task.dueDate)}
          </Text>
        </View>

        <View
          style={[
            styles.priorityBadge,
            { backgroundColor: getPriorityColor(task.priority) + '20' },
          ]}
        >
          <Flag size={12} color={getPriorityColor(task.priority)} />
          <Text
            style={[styles.priorityText, { color: getPriorityColor(task.priority) }]}
          >
            {task.priority}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  checkboxContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  taskInfo: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    marginBottom: 4,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  deleteButton: {
    padding: 4,
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dueDate: {
    fontSize: 12,
    fontWeight: '500',
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '600',
  },
});