import {StatusBar, View} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';

import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Provider, useDispatch, useSelector} from 'react-redux';
import {AppDispatch, store} from './src/stores/redux';
import AppRouters from './src/navigators/AppRouters';

import {Host} from 'react-native-portalize';
import ToastComponent from './src/components/ToastComponent';
import {StripeProvider} from '@stripe/stripe-react-native';
import socket from './src/apis/socket';

const App = () => {
  // useEffect(() => {
  //   socket.on('delete-received-order', data => {
  //     console.log('abc');

  //     console.log(data);

  //     // dispatch(removeFromListOrderReceived(data));
  //   });
  // }, []);
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
            <StripeProvider publishableKey="pk_test_51RUMpNFZGiPLPpYFmxWGpPxiqWRL6mk23UJg1bdxj6dtkGqVwglUeVHYTbDTNM2HHeLc6KfYdG8l4DAimuPi7BRU004sREQ4sn">
              <AppRouters></AppRouters>
            </StripeProvider>
          </NavigationContainer>
        </Host>
        <ToastComponent></ToastComponent>
      </Provider>
    </GestureHandlerRootView>
    // <View style={{flex: 1, backgroundColor: 'coral'}}></View>
  );
};

export default App;
