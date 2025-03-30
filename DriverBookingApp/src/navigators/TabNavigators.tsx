import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {AddSquare, Calendar, Location, User} from 'iconsax-react-native';
import React, {ReactNode} from 'react';
import {Platform} from 'react-native';
import {CircleComponent, TextComponent} from '../components';
import {appColors} from '../constants/appColors';

import {globalStyles} from '../styles/globalStyles';
import ProfileNavigator from './ProfileNavigator';
import HomeNavigator from './HomeNavigators';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import OrdersNavigators from './OrdersNavigators';
import MessageNavigator from './MessageNavigator';

const TabNavigator = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        // unmountOnBlur: true,
        headerShown: false,
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 88 : 68,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: appColors.white,
        },
        tabBarHideOnKeyboard: true,
        tabBarIcon: ({focused, color, size}) => {
          let icon: ReactNode;
          color = focused ? appColors.primary : appColors.gray5;
          size = 24;
          switch (route.name) {
            case 'Home':
              icon = <MaterialIcons name="home" size={size} color={color} />;
              break;

            case 'Orders':
              icon = <Calendar size={size} variant="Bold" color={color} />;
              break;
            case 'Message':
              icon = <Location size={size} variant="Bold" color={color} />;
              break;
            case 'Profile':
              icon = <User size={size} variant="Bold" color={color} />;
              break;

            case 'Add':
              icon = (
                <CircleComponent
                  size={52}
                  styles={[
                    globalStyles.shadow,
                    {marginTop: 10},
                    // {marginTop: Platform.OS === 'ios' ? -50 : -60},
                  ]}>
                  <AddSquare size={24} color={appColors.white} variant="Bold" />
                </CircleComponent>
              );
              break;
          }
          return icon;
        },
        tabBarIconStyle: {
          marginTop: 8,
        },
        tabBarLabelPosition: 'below-icon',
        tabBarLabel({focused}) {
          return route.name === 'Add' ? null : (
            <TextComponent
              text={route.name}
              flex={0}
              size={12}
              color={focused ? appColors.primary : appColors.gray5}
              styles={{
                marginBottom: Platform.OS === 'android' ? 12 : 0,
              }}
            />
          );
        },
      })}>
      <Tab.Screen name="Home" component={HomeNavigator} />
      {/* <Tab.Screen name="Events" component={EventNavigator} />
      <Tab.Screen name="Add" component={AddNewEventNavigator} />
       */}
      <Tab.Screen name="Orders" component={OrdersNavigators} />
      <Tab.Screen name="Message" component={MessageNavigator} />
      <Tab.Screen name="Profile" component={ProfileNavigator} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
