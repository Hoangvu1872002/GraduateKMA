import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import TabNavigator from './TabNavigators';
import DrawerNavigator from './DrawerNavigator';
const MainNavigator = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Main" component={DrawerNavigator} />
      {/* <Stack.Screen name="Main" component={TabNavigator}></Stack.Screen> */}
    </Stack.Navigator>
  );
};

export default MainNavigator;
