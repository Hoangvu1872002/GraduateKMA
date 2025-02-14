import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';

import AddNewScreen from '../screens/events/AddNewScreen';
import ScreenLocationSave from '../screens/events/ScreenLocationSave';

const AddNewEventNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="AddNewEventScreen" component={AddNewScreen} />
      <Stack.Screen name="ScreenLocationSave" component={ScreenLocationSave} />
    </Stack.Navigator>
  );
};

export default AddNewEventNavigator;
