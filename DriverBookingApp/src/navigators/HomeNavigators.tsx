import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import HomeScreen from '../screens/home/HomeScreen';
import HistoryScreen from '../screens/history/HistoryScreen';
import DetailHistory from '../screens/history/DetailHistory';
import MapView from '../screens/maps/MapView';
import Dashboard from '../screens/home/Dashboard';

const HomeNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="HistoryScreen" component={HistoryScreen} />
      <Stack.Screen name="DetailHistory" component={DetailHistory} />
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="MapView" component={MapView} />
    </Stack.Navigator>
  );
};

export default HomeNavigator;
