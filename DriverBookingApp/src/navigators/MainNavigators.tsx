import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import TabNavigator from './TabNavigators';
import DetailOrderScreen from '../screens/orders/DetailOrderScreen';
import DirectionsMapScreen from '../screens/maps/DirectionsMapScreen';
const MainNavigator = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen name="DetailOrderScreen" component={DetailOrderScreen} />
      <Stack.Screen
        name="DirectionsMapScreen"
        component={DirectionsMapScreen}
      />
      {/* <Stack.Screen name="Main" component={TabNavigator}></Stack.Screen> */}
    </Stack.Navigator>
  );
};

export default MainNavigator;
