import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {AddSquare, Calendar, Location, User} from 'iconsax-react-native';
import React, {ReactNode} from 'react';
import {Platform} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {CircleComponent, TextComponent} from '../components';
import {appColors} from '../constants/appColors';

import {globalStyles} from '../styles/globalStyles';
import ExploreNavigator from './ExploreNavigator';

import EventNavigator from './EventNavigator';
import ProfileNavigator from './ProfileNavigator';
import AddNewEventNavigator from './AddNewEventNavigator';
import HistoryNavigator from './HistoryNavigator';
import MessageNavigator from './MessageNavigator';

const TabNavigator = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
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
            case 'Explore':
              icon = <MaterialIcons name="explore" size={size} color={color} />;
              break;

            case 'Events':
              icon = <Calendar size={size} variant="Bold" color={color} />;
              break;
            case 'History':
              icon = <Location size={size} variant="Bold" color={color} />;
              break;
            case 'Profile':
              icon = <User size={size} variant="Bold" color={color} />;
              break;

            case 'Message':
              icon = (
                // <CircleComponent
                //   size={52}
                //   styles={[
                //     globalStyles.shadow,
                //     {marginTop: 10},
                //     // {marginTop: Platform.OS === 'ios' ? -50 : -60},
                //   ]}>
                <AddSquare size={24} color={color} variant="Bold" />
                // </CircleComponent>
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
          return (
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
      <Tab.Screen name="Explore" component={ExploreNavigator} />
      <Tab.Screen name="Events" component={EventNavigator} />
      <Tab.Screen name="Message" component={MessageNavigator} />
      <Tab.Screen name="History" component={HistoryNavigator} />
      <Tab.Screen name="Profile" component={ProfileNavigator} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
