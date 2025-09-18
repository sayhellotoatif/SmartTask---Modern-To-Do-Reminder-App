import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Flag } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Priority } from '@/services/TaskService';

interface PrioritySelectorProps {
  selectedPriority: Priority;
  onPriorityChange: (priority: Priority) => void;
}

export function PrioritySelector({ selectedPriority, onPriorityChange }: PrioritySelectorProps) {
  const { colors } = useTheme();

  const priorities: { value: Priority; color: string }[] = [
    { value: 'Low', color: '#059669' },
    { value: 'Medium', color: '#D97706' },
    { value: 'High', color: '#DC2626' },
  ];

  return (
    <View style={styles.container}>
      {priorities.map(({ value, color }) => {
        const isSelected = selectedPriority === value;
        
        return (
          <TouchableOpacity
            key={value}
            style={[
              styles.priorityButton,
              {
                backgroundColor: isSelected ? color + '20' : colors.surface,
                borderColor: isSelected ? color : colors.border,
              },
            ]}
            onPress={() => onPriorityChange(value)}
            activeOpacity={0.7}
          >
            <Flag
              size={16}
              color={isSelected ? color : colors.textSecondary}
              fill={isSelected ? color : 'none'}
            />
            <Text
              style={[
                styles.priorityText,
                { color: isSelected ? color : colors.text },
              ]}
            >
              {value}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 2,
    gap: 8,
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '600',
  },
});