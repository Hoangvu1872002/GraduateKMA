import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import AddNewScreen from '../screens/events/AddNewScreen';

const MapNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="MapScreen" component={AddNewScreen} />
    </Stack.Navigator>
  );
};

export default MapNavigator;
