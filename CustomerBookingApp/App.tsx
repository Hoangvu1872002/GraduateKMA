import {StatusBar} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';

import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Provider, useSelector} from 'react-redux';
import {store} from './src/stores/redux';
import AppRouters from './src/navigators/AppRouters';
import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';
import ToastComponent from './src/components/ToastComponent';

const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Provider store={store}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="transparent"
          translucent
        />
        <NavigationContainer>
          <AppRouters></AppRouters>
        </NavigationContainer>
        <ToastComponent></ToastComponent>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
