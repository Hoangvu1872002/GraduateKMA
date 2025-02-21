import {StatusBar} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';

import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Provider, useSelector} from 'react-redux';
import {store} from './src/stores/redux';
import AppRouters from './src/navigators/AppRouters';
import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';
import ToastComponent from './src/components/ToastComponent';
import {Host} from 'react-native-portalize';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {useEffect} from 'react';
import socket from './src/apis/socket';

const App = () => {
  useEffect(() => {
    socket.emit('find-a-driver', {room: 'global'});
  }, []);
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Provider store={store}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="transparent"
          translucent
        />
        <Host>
          <NavigationContainer>
            <AppRouters></AppRouters>
          </NavigationContainer>
        </Host>
        <ToastComponent></ToastComponent>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
