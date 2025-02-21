import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import OnbroadingScreen from '../screens/auth/onbroading/OnBroadingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ForgotPassword, LoginScreen} from '../screens';
import RegisterScreen from '../screens/auth/register/RegisterScreen';
import Verification from '../screens/auth/verification/Verification';

const AuthNavigator = () => {
  const Stack = createNativeStackNavigator();

  const [isExistingUser, setIsExistingUser] = useState<Boolean>();

  useEffect(() => {
    checkUserExisting();
  }, []);

  const checkUserExisting = async () => {
    const res = await AsyncStorage.getItem('accountSave');

    if (res) setIsExistingUser(true);
    else setIsExistingUser(false);
  };

  return (
    <>
      {isExistingUser !== undefined && (
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}>
          {!isExistingUser && (
            <Stack.Screen
              name="OnbroadingScreen"
              component={OnbroadingScreen}
            />
          )}
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen name="Verification" component={Verification} />
        </Stack.Navigator>
      )}
    </>
  );
};

export default AuthNavigator;
