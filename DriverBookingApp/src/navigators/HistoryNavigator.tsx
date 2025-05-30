import {View, Text} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HistoryScreen from '../screens/history/HistoryScreen';
import DetailHistory from '../screens/history/DetailHistory';

const HistoryNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="HistoryScreen" component={HistoryScreen} />
      <Stack.Screen name="DetailHistory" component={DetailHistory} />
    </Stack.Navigator>
  );
};

export default HistoryNavigator;
