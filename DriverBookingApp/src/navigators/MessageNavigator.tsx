import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import ListRoomMessageScreen from '../screens/message/ListRoomMessageScreen';

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
      {/* <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} /> */}
    </Stack.Navigator>
  );
};

export default MessageNavigator;
