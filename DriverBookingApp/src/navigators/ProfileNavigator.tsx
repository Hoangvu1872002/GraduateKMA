import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import ProfileScreen from '../screens/profiles/ProfileScreen';

const ProfileNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      {/* <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} /> */}
    </Stack.Navigator>
  );
};

export default ProfileNavigator;
