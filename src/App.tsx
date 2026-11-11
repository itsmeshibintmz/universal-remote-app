/**
 * Universal Remote App - Main Application Entry
 */

import React from 'react';
import { StyleSheet, View, SafeAreaView, StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { store } from '@store/store';
import { Colors } from '@theme/colors';
import HomeScreen from './screens/HomeScreen';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
        <HomeScreen />
      </SafeAreaView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});

export default App;
