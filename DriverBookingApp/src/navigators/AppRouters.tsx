import AsyncStorage, {
  useAsyncStorage,
} from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {RootState} from '../stores/redux';
import MainNavigator from './MainNavigators';

import SplashScreen from '../screens/splash/SplashScreen';
import AuthNavigator from './AuthNavigators';
import {View} from 'react-native';

const AppRouters = () => {
  const [isShowSplash, setIsShowSpash] = useState(true);

  const {isLoggedIn} = useSelector((state: RootState) => state.user);

  // console.log(isLoggedIn);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setIsShowSpash(false);
    }, 2000);

    return () => clearTimeout(timeOut);
  }, []);

  return (
    <>
      {isShowSplash ? (
        <SplashScreen />
      ) : isLoggedIn ? (
        <MainNavigator />
      ) : (
        <AuthNavigator />
        // <View style={{flex: 1, backgroundColor: 'coral'}}></View>
      )}
    </>
  );
};

export default AppRouters;
