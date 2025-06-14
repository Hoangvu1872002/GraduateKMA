import AsyncStorage, {
  useAsyncStorage,
} from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Toast from 'react-native-toast-message';

import {AppDispatch, RootState} from '../stores/redux';
import MainNavigator from './MainNavigators';

import SplashScreen from '../screens/splash/SplashScreen';
import AuthNavigator from './AuthNavigators';
import {View} from 'react-native';
import socket from '../apis/socket';
import {apiUpdateSocketId} from '../apis';
import {getCurrent} from '../stores/users/asyncAction';
import {
  addToListOrderReceived,
  removeFromListOrderReceived,
  setOrderPending,
} from '../stores/users/userSlide';

const AppRouters = () => {
  const [isShowSplash, setIsShowSpash] = useState(true);

  const {isLoggedIn} = useSelector((state: RootState) => state.user);

  const dispatch = useDispatch<AppDispatch>();

  // useEffect(() => {
  //   socket.on('new-order', data => {
  //     dispatch(addToListOrderReceived(data));
  //   });
  //   socket.on('delete-received-order', data => {
  //     dispatch(removeFromListOrderReceived(data));
  //   });
  //   socket.on('notice-driver-receipted-order', data => {
  //     dispatch(setOrderPending(data.billWithUser));
  //     // console.log(data);
  //   });
  //   socket.on('notice-remove-order-from-user', data => {
  //     dispatch(removeFromListOrderReceived(data));
  //     // console.log(data);
  //   });
  // }, []);
  useEffect(() => {
    const handleNewOrder = (data: any) => {
      dispatch(addToListOrderReceived(data));
    };
    const handleDeleteReceivedOrder = (data: any) => {
      dispatch(removeFromListOrderReceived(data));
    };
    const handleDriverReceiptedOrder = (data: any) => {
      dispatch(setOrderPending(data.billWithUser));
    };
    const handleRemoveOrderFromUser = (data: any) => {
      dispatch(removeFromListOrderReceived(data));
      Toast.show({
        type: 'error',
        text1: 'Customer has canceled the order',
        text2: 'The order you just received has been canceled by the customer.',
        position: 'top',
        visibilityTime: 3000,
      });
    };

    const handlePaymentSuccess = (data: any) => {
      dispatch(getCurrent());
      Toast.show({
        type: 'success',
        text1: 'Customer payment successful',
        text2: 'You have received money in your wallet.',
        position: 'top',
        visibilityTime: 4000,
      });
    };

    socket.on('new-order', handleNewOrder);
    socket.on('delete-received-order', handleDeleteReceivedOrder);
    socket.on('notice-driver-receipted-order', handleDriverReceiptedOrder);
    socket.on('notice-remove-order-from-user', handleRemoveOrderFromUser);
    socket.on('payment-success', handlePaymentSuccess);

    return () => {
      socket.off('new-order', handleNewOrder);
      socket.off('delete-received-order', handleDeleteReceivedOrder);
      socket.off('notice-driver-receipted-order', handleDriverReceiptedOrder);
      socket.off('notice-remove-order-from-user', handleRemoveOrderFromUser);
      socket.on('payment-success', handlePaymentSuccess);
    };
  }, []);

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
