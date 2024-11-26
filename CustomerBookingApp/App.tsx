import {View, Text, StatusBar} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SplashScreen} from './src/screens';
import AuthNavigator from './src/navigators/AuthNavigators';
import {NavigationContainer} from '@react-navigation/native';
import {useAsyncStorage} from '@react-native-async-storage/async-storage';
import MainNavigator from './src/navigators/MainNavigators';

const App = () => {
  const [isShowSplash, setIsShowSpash] = useState(true);
  const [accessToken, setAccessToken] = useState('');

  const {getItem, setItem} = useAsyncStorage('assetToken');

  const checkLogin = async () => {
    const token = await getItem();
    console.log(token);

    token && setAccessToken(token);
  };

  useEffect(() => {
    checkLogin();
  }, []);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setIsShowSpash(false);
    }, 2000);

    return () => clearTimeout(timeOut);
  }, []);

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent></StatusBar>
      {isShowSplash ? (
        <SplashScreen />
      ) : (
        <NavigationContainer>
          {accessToken ? (
            <MainNavigator></MainNavigator>
          ) : (
            <AuthNavigator></AuthNavigator>
          )}

          {/* <SplashScreen /> */}
        </NavigationContainer>
      )}
    </>
  );
};

export default App;
