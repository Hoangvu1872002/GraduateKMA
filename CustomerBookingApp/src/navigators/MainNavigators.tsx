import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import TabNavigator from './TabNavigators';
import DrawerNavigator from './DrawerNavigator';
import ScreenLocationBooking from '../screens/maps/screenSelectLocations/ScreenLocationBooking';
import ModalMapConfirnRoute from '../screens/maps/screenShowMaps/ScreenlMapConfirmRoute';
import ScreenMapFindDriver from '../screens/maps/screenShowMaps/ScreenMapFindDriver';
import ScreenMapFollowDriver from '../screens/maps/screenShowMaps/ScreenMapFollowDriver';
import RoomMessageScreen from '../screens/message/RoomMessageScreen';
import Dashboard from '../screens/home/Dashboard';
import ConfirmInfBill from '../screens/bill/ConfirmInfBill';
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
      <Stack.Screen
        name="ScreenMapFollowDriver"
        component={ScreenMapFollowDriver}
      />
      <Stack.Screen name="RoomMessageScreen" component={RoomMessageScreen} />
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="ConfirmInfBill" component={ConfirmInfBill} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
