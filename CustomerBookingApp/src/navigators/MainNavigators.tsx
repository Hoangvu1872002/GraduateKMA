import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import TabNavigator from './TabNavigators';
import DrawerNavigator from './DrawerNavigator';
import ScreenLocationBooking from '../screens/maps/screenSelectLocations/ScreenLocationBooking';
import ModalMapConfirnRoute from '../screens/maps/screenShowMaps/ScreenlMapConfirmRoute';
import ScreenMapFindDriver from '../screens/maps/screenShowMaps/ScreenMapFindDriver';
const MainNavigator = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Main" component={DrawerNavigator} />
      <Stack.Screen
        name="ScreenLocationBooking"
        component={ScreenLocationBooking}
      />
      <Stack.Screen
        name="ModalMapConfirnRoute"
        component={ModalMapConfirnRoute}
      />
      <Stack.Screen
        name="ScreenMapFindDriver"
        component={ScreenMapFindDriver}
      />
      {/* <Stack.Screen name="Main" component={TabNavigator}></Stack.Screen> */}
    </Stack.Navigator>
  );
};

export default MainNavigator;
