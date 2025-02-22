import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import HomeScreen from '../screens/home/HomeScreen';

const HomeNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      {/* <Stack.Screen name="SearchEvents" component={SearchEvents} />
      <Stack.Screen name="EventDetail" component={EventDetail} /> */}
    </Stack.Navigator>
  );
};

export default HomeNavigator;
