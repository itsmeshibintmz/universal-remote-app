/**
 * Home Screen
 * Display list of devices and allow discovery
 */

import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, Text, ActivityIndicator, RefreshControl } from 'react-native';
import { useAppDispatch, useDevices, useIsDiscovering } from '@store/hooks';
import { discoverDevices, setActiveDevice } from '@store/slices/deviceSlice';
import { Colors, Spacing, Typography } from '@theme/index';
import GlassButton from '@components/GlassButton';
import WiFiService from '@services/WiFiService';

const HomeScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const devices = useDevices();
  const isDiscovering = useIsDiscovering();
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    // Initial discovery
    performDiscovery();
  }, []);

  const performDiscovery = async () => {
    try {
      setRefreshing(true);
      // Dispatch the discover action
      dispatch(discoverDevices());
    } catch (error) {
      console.error('Discovery failed:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleDevicePress = (deviceId: string) => {
    dispatch(setActiveDevice(deviceId));
    // Navigate to control screen
    console.log('Navigating to control for device:', deviceId);
  };

  const renderDeviceItem = ({ item }: any) => (
    <View style={styles.deviceCard}>
      <Text style={styles.deviceName}>{item.name}</Text>
      <Text style={styles.deviceType}>{item.type}</Text>
      <Text style={styles.deviceIP}>{item.ip}:{item.port}</Text>
      <GlassButton
        label="Control"
        onPress={() => handleDevicePress(item.id)}
        variant="primary"
        size="small"
      />
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No Devices Found</Text>
      <Text style={styles.emptySubtitle}>
        Tap the button below to discover devices on your network
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Universal Remote</Text>
        <Text style={styles.subtitle}>Control your smart devices</Text>
      </View>

      {/* Device List */}
      <FlatList
        data={devices}
        renderItem={renderDeviceItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing || isDiscovering}
            onRefresh={performDiscovery}
          />
        }
      />

      {/* Discovery Button */}
      <View style={styles.footer}>
        {isDiscovering && <ActivityIndicator size="large" color={Colors.primary} />}
        <GlassButton
          label={isDiscovering ? 'Discovering...' : 'Discover Devices'}
          onPress={performDiscovery}
          disabled={isDiscovering}
          variant="primary"
          size="large"
          style={styles.discoverButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
  },

  title: {
    ...Typography.styles.h2,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },

  subtitle: {
    ...Typography.styles.bodySmall,
    color: Colors.text.secondary,
  },

  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },

  deviceCard: {
    backgroundColor: Colors.glass.light,
    borderRadius: Spacing.radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.glass.lighter,
  },

  deviceName: {
    ...Typography.styles.bodyBold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },

  deviceType: {
    ...Typography.styles.caption,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },

  deviceIP: {
    ...Typography.styles.caption,
    color: Colors.text.tertiary,
    marginBottom: Spacing.md,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },

  emptyTitle: {
    ...Typography.styles.h3,
    color: Colors.text.secondary,
    marginBottom: Spacing.md,
  },

  emptySubtitle: {
    ...Typography.styles.body,
    color: Colors.text.tertiary,
    textAlign: 'center',
  },

  footer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },

  discoverButton: {
    width: '100%',
  },
});

export default HomeScreen;
