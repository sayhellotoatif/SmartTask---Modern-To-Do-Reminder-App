import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import { Calendar, Flag, StretchVertical as AlphabeticalSort, X } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

interface SortModalProps {
  currentSort: 'date' | 'priority' | 'alphabetical';
  onSortChange: (sort: 'date' | 'priority' | 'alphabetical') => void;
  onClose: () => void;
}

export function SortModal({ currentSort, onSortChange, onClose }: SortModalProps) {
  const { colors } = useTheme();

  const sortOptions = [
    {
      key: 'date' as const,
      title: 'Due Date',
      description: 'Sort by reminder time',
      icon: Calendar,
    },
    {
      key: 'priority' as const,
      title: 'Priority',
      description: 'High to low priority',
      icon: Flag,
    },
    {
      key: 'alphabetical' as const,
      title: 'Alphabetical',
      description: 'A to Z by title',
      icon: AlphabeticalSort,
    },
  ];

  return (
    <View style={[styles.modal, { backgroundColor: colors.surface }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Sort Tasks</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7}>
          <X size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.options}>
        {sortOptions.map(({ key, title, description, icon: Icon }) => {
          const isSelected = currentSort === key;
          
          return (
            <TouchableOpacity
              key={key}
              style={[
                styles.option,
                {
                  backgroundColor: isSelected ? colors.primary + '20' : 'transparent',
                  borderColor: isSelected ? colors.primary : colors.border,
                },
              ]}
              onPress={() => onSortChange(key)}
              activeOpacity={0.7}
            >
              <Icon
                size={20}
                color={isSelected ? colors.primary : colors.textSecondary}
              />
              <View style={styles.optionText}>
                <Text
                  style={[
                    styles.optionTitle,
                    { color: isSelected ? colors.primary : colors.text },
                  ]}
                >
                  {title}
                </Text>
                <Text style={[styles.optionDescription, { color: colors.textSecondary }]}>
                  {description}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modal: {
    borderRadius: 20,
    padding: 20,
    margin: 20,
    minWidth: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    padding: 4,
  },
  options: {
    gap: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    gap: 12,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 12,
  },
});