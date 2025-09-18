import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { X, Flag, SquareCheck as CheckSquare, Square } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Priority } from '@/services/TaskService';

interface Filters {
  priority: Priority | null;
  completed: boolean | null;
}

interface FilterModalProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onClose: () => void;
}

export function FilterModal({ filters, onFiltersChange, onClose }: FilterModalProps) {
  const { colors } = useTheme();

  const priorities: Priority[] = ['High', 'Medium', 'Low'];

  const updateFilter = (key: keyof Filters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({ priority: null, completed: null });
    onClose();
  };

  return (
    <View style={[styles.modal, { backgroundColor: colors.surface }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Filter Tasks</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7}>
          <X size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Priority Filter */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Priority</Text>
        <View style={styles.filterGroup}>
          <TouchableOpacity
            style={[
              styles.filterOption,
              {
                backgroundColor: !filters.priority ? colors.primary + '20' : 'transparent',
                borderColor: !filters.priority ? colors.primary : colors.border,
              },
            ]}
            onPress={() => updateFilter('priority', null)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.filterText,
                { color: !filters.priority ? colors.primary : colors.text },
              ]}
            >
              All
            </Text>
          </TouchableOpacity>

          {priorities.map((priority) => {
            const isSelected = filters.priority === priority;
            const priorityColor = priority === 'High' ? '#DC2626' : priority === 'Medium' ? '#D97706' : '#059669';
            
            return (
              <TouchableOpacity
                key={priority}
                style={[
                  styles.filterOption,
                  {
                    backgroundColor: isSelected ? colors.primary + '20' : 'transparent',
                    borderColor: isSelected ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => updateFilter('priority', priority)}
                activeOpacity={0.7}
              >
                <Flag size={14} color={priorityColor} />
                <Text
                  style={[
                    styles.filterText,
                    { color: isSelected ? colors.primary : colors.text },
                  ]}
                >
                  {priority}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Status Filter */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Status</Text>
        <View style={styles.filterGroup}>
          <TouchableOpacity
            style={[
              styles.filterOption,
              {
                backgroundColor: filters.completed === null ? colors.primary + '20' : 'transparent',
                borderColor: filters.completed === null ? colors.primary : colors.border,
              },
            ]}
            onPress={() => updateFilter('completed', null)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.filterText,
                { color: filters.completed === null ? colors.primary : colors.text },
              ]}
            >
              All
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterOption,
              {
                backgroundColor: filters.completed === false ? colors.primary + '20' : 'transparent',
                borderColor: filters.completed === false ? colors.primary : colors.border,
              },
            ]}
            onPress={() => updateFilter('completed', false)}
            activeOpacity={0.7}
          >
            <Square size={14} color={colors.text} />
            <Text
              style={[
                styles.filterText,
                { color: filters.completed === false ? colors.primary : colors.text },
              ]}
            >
              Active
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterOption,
              {
                backgroundColor: filters.completed === true ? colors.primary + '20' : 'transparent',
                borderColor: filters.completed === true ? colors.primary : colors.border,
              },
            ]}
            onPress={() => updateFilter('completed', true)}
            activeOpacity={0.7}
          >
            <CheckSquare size={14} color={colors.primary} />
            <Text
              style={[
                styles.filterText,
                { color: filters.completed === true ? colors.primary : colors.text },
              ]}
            >
              Completed
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.clearButton, { borderColor: colors.border }]}
          onPress={clearFilters}
          activeOpacity={0.7}
        >
          <Text style={[styles.clearButtonText, { color: colors.textSecondary }]}>
            Clear All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.applyButton, { backgroundColor: colors.primary }]}
          onPress={onClose}
          activeOpacity={0.7}
        >
          <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>
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
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    padding: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  filterGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  clearButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});