import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {EventsScreen} from '../screens';
import EventDetail from '../screens/events/EventDetail';
import AddNewScreen from '../screens/events/AddNewScreen';
// import {useStatusBar} from '../hooks/useStatusBar';

const EventNavigator = () => {
  const Stack = createNativeStackNavigator();
  //   useStatusBar('dark-content');
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="EventsScreen" component={EventsScreen} />
      <Stack.Screen name="EventDetail" component={EventDetail} />
      <Stack.Screen name="AddNewEvent" component={AddNewScreen} />
    </Stack.Navigator>
  );
};

export default EventNavigator;
