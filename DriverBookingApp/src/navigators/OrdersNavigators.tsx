import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';

import OrdersScreen from '../screens/orders/OrdersScreen';

const OrdersNavigators = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="OrdersScreen" component={OrdersScreen} />
    </Stack.Navigator>
  );
};

export default OrdersNavigators;
