import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Search, Filter, X } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { TaskCard } from '@/components/TaskCard';
import { FilterModal } from '@/components/FilterModal';
import { TaskService, Task, Priority } from '@/services/TaskService';

export default function SearchScreen() {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    priority: null as Priority | null,
    completed: null as boolean | null,
  });

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tasks, searchQuery, filters]);

  const loadTasks = async () => {
    try {
      const allTasks = await TaskService.getAllTasks();
      setTasks(allTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const applyFilters = () => {
    let filtered = tasks;

    // Apply search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        task =>
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query)
      );
    }

    // Apply priority filter
    if (filters.priority) {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }

    // Apply completion status filter
    if (filters.completed !== null) {
      filtered = filtered.filter(task => task.isCompleted === filters.completed);
    }

    setFilteredTasks(filtered);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const clearFilters = () => {
    setFilters({
      priority: null,
      completed: null,
    });
  };

  const hasActiveFilters = filters.priority !== null || filters.completed !== null;

  const getFilterText = () => {
    const parts = [];
    if (filters.priority) parts.push(filters.priority);
    if (filters.completed !== null) {
      parts.push(filters.completed ? 'Completed' : 'Active');
    }
    return parts.join(', ');
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={[styles.title, { color: colors.text }]}>Search Tasks</Text>
      
      {/* Search Input */}
      <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Search size={20} color={colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by title or description..."
          placeholderTextColor={colors.textSecondary}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={clearSearch} activeOpacity={0.7}>
            <X size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Filter Button */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            {
              backgroundColor: hasActiveFilters ? colors.primary : colors.surface,
              borderColor: hasActiveFilters ? colors.primary : colors.border,
            },
          ]}
          onPress={() => setShowFilterModal(true)}
          activeOpacity={0.7}
        >
          <Filter size={16} color={hasActiveFilters ? '#FFFFFF' : colors.primary} />
          <Text
            style={[
              styles.filterButtonText,
              { color: hasActiveFilters ? '#FFFFFF' : colors.primary },
            ]}
          >
            Filter
          </Text>
        </TouchableOpacity>

        {hasActiveFilters && (
          <TouchableOpacity
            style={[styles.clearFiltersButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={clearFilters}
            activeOpacity={0.7}
          >
            <Text style={[styles.clearFiltersText, { color: colors.textSecondary }]}>
              Clear ({getFilterText()})
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderEmptyState = () => {
    if (searchQuery || hasActiveFilters) {
      return (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
            No tasks match your search criteria
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyState}>
        <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
          Start typing to search through your tasks
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {renderHeader()}
      
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onComplete={() => {}}
            onDelete={() => {}}
          />
        )}
        contentContainerStyle={filteredTasks.length === 0 ? styles.emptyContainer : styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />

      {showFilterModal && (
        <FilterModal
          filters={filters}
          onFiltersChange={setFilters}
          onClose={() => setShowFilterModal(false)}
        />
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
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  clearFiltersButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  clearFiltersText: {
    fontSize: 12,
    fontWeight: '500',
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
});