import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {ListRoomMessageScreen} from '../screens';
import RoomMessageScreen from '../screens/message/RoomMessageScreen';

const MessageNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="ListRoomMessageScreen"
        component={ListRoomMessageScreen}
      />
    </Stack.Navigator>
  );
};

export default MessageNavigator;
