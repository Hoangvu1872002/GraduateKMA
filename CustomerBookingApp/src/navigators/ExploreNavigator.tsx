import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {HomeScreen, ListRoomMessageScreen} from '../screens';

import EventDetail from '../screens/events/EventDetail';
import ScreenLocationSave from '../screens/events/ScreenLocationSave';
import ScreenLocationBooking from '../screens/maps/screenSelectLocations/ScreenLocationBooking';

const ExploreNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen
        name="ListRoomMessageScreen"
        component={ListRoomMessageScreen}
      />
      <Stack.Screen name="EventDetail" component={EventDetail} />
    </Stack.Navigator>
  );
};

export default ExploreNavigator;
