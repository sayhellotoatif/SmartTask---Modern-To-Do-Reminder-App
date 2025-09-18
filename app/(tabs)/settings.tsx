import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { Moon, Sun, Bell, Download, Upload, Info } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { SettingsSection } from '@/components/SettingsSection';

export default function SettingsScreen() {
  const { colors, isDark, toggleTheme } = useTheme();

  const handleExportData = () => {
    // TODO: Implement data export
    console.log('Export data');
  };

  const handleImportData = () => {
    // TODO: Implement data import
    console.log('Import data');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>

        <SettingsSection title="Appearance">
          <View style={[styles.settingItem, { backgroundColor: colors.surface }]}>
            <View style={styles.settingLeft}>
              {isDark ? (
                <Moon size={20} color={colors.primary} />
              ) : (
                <Sun size={20} color={colors.primary} />
              )}
              <Text style={[styles.settingText, { color: colors.text }]}>
                {isDark ? 'Dark Mode' : 'Light Mode'}
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </SettingsSection>

        <SettingsSection title="Notifications">
          <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: colors.surface }]}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <Bell size={20} color={colors.primary} />
              <Text style={[styles.settingText, { color: colors.text }]}>
                Notification Settings
              </Text>
            </View>
          </TouchableOpacity>
        </SettingsSection>

        <SettingsSection title="Data Management">
          <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: colors.surface }]}
            onPress={handleExportData}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <Download size={20} color={colors.primary} />
              <Text style={[styles.settingText, { color: colors.text }]}>
                Export Tasks
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: colors.surface }]}
            onPress={handleImportData}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <Upload size={20} color={colors.primary} />
              <Text style={[styles.settingText, { color: colors.text }]}>
                Import Tasks
              </Text>
            </View>
          </TouchableOpacity>
        </SettingsSection>

        <SettingsSection title="About">
          <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: colors.surface }]}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <Info size={20} color={colors.primary} />
              <View>
                <Text style={[styles.settingText, { color: colors.text }]}>
                  SmartTask
                </Text>
                <Text style={[styles.settingSubtext, { color: colors.textSecondary }]}>
                  Version 1.0.0
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </SettingsSection>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 30,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 8,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingSubtext: {
    fontSize: 12,
    marginTop: 2,
  },
});