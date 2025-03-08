import AsyncStorage, {
  useAsyncStorage,
} from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {SplashScreen} from '../screens';
import {AppDispatch, RootState} from '../stores/redux';
import MainNavigator from './MainNavigators';
import AuthNavigator from './AuthNavigators';
// import socket from '../apis/socket';
// import {apiUpdateSocketId} from '../apis';
// import {getCurrent} from '../stores/users/asyncAction';
// import {addToListOrderpending} from '../stores/users/userSlide';

const AppRouters = () => {
  const [isShowSplash, setIsShowSpash] = useState(true);

  const {isLoggedIn} = useSelector((state: RootState) => state.user);

  // console.log(isLoggedIn);

  // const dispatch = useDispatch<AppDispatch>();

  // useEffect(() => {
  //   socket.on('notice-driver-receipted-order', data => {
  //     dispatch(addToListOrderpending(data.newBill));
  //   });
  // }, []);

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
      )}
    </>
  );
};

export default AppRouters;
