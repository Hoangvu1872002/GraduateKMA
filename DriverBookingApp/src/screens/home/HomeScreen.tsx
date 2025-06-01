import {View, Text, Button, Platform, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../stores/redux';
import {logout, setCurrentLocation} from '../../stores/users/userSlide';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import {apiUpdateLocationDriver} from '../../apis';
import {getCurrent} from '../../stores/users/asyncAction';
import socket from '../../apis/socket';
import {globalStyles} from '../../styles/globalStyles';
import LinearGradient from 'react-native-linear-gradient';
import {appColors} from '../../constants/appColors';
import {
  CircleComponent,
  RowComponent,
  SpaceComponent,
  TagComponent,
  TextComponent,
} from '../../components';
import {
  HambergerMenu,
  Logout,
  Moneys,
  Notification,
  Sort,
} from 'iconsax-react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {fontFamilies} from '../../constants/fontFamilies';
import {StatusBar} from 'react-native';

const HomeScreen = ({navigation}: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const {isLoggedIn, current, currentLocation} = useSelector(
    (state: RootState) => state.user,
  );

  const [unReadNotifications, setUnReadNotifications] = useState([]);
  const [currentLocationName, setCurrentLocationName] = useState();

  const reverseGeoCode = async ({lat, long}: {lat: number; long: number}) => {
    // console.log(lat, long);

    const api = `https://rsapi.goong.io/Geocode?latlng=${lat},${long}&api_key=crMmofRW2lgZNiDMZtCUdYqHZfGZv1cVZ864e0CR`;

    try {
      const res = await axios.get(api);

      if (res && res.status === 200 && res.data.results[0]) {
        const items = res.data.results[0].address;
        setCurrentLocationName(items);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const setTimeoutId = setTimeout(() => {
      if (isLoggedIn) dispatch(getCurrent());
    }, 300);

    return () => {
      clearTimeout(setTimeoutId);
    };
  }, [isLoggedIn]);

  useEffect(() => {
    reverseGeoCode({
      lat: currentLocation?.latitude || 0,
      long: currentLocation?.longitude || 0,
    });
  }, [currentLocation]);

  useEffect(() => {
    const watchId = Geolocation.watchPosition(
      async position => {
        dispatch(
          setCurrentLocation({
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
          }),
        );
        await apiUpdateLocationDriver({
          longitude: position.coords.longitude,
          latitude: position.coords.latitude,
        });
      },
      error => console.error('Lỗi lấy tọa độ:', error),
      {enableHighAccuracy: true, distanceFilter: 100, interval: 5000},
    );

    return () => Geolocation.clearWatch(watchId);
  }, []);

  return (
    <View style={[globalStyles.container]}>
      <StatusBar barStyle={'dark-content'} />
      {/* <LinearGradient colors={['#4A708B', 'rgba(42, 31, 197, 0)']}> */}
      <View
        style={{
          backgroundColor: appColors.DarkSlateGrayBlue4,
          // height: Platform.OS === 'android' ? 168 : 182,
          // height: 182,
          height: 150,
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
          paddingTop:
            Platform.OS === 'android'
              ? (StatusBar.currentHeight ?? 0) + 10
              : 52,
        }}>
        <View style={{paddingHorizontal: 16}}>
          <RowComponent>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <HambergerMenu size={24} color={appColors.white} />
            </TouchableOpacity>
            <View style={[{flex: 1, alignItems: 'center'}]}>
              <RowComponent>
                <TextComponent
                  text="Current Location"
                  color={appColors.white2}
                  size={12}
                />
                <MaterialIcons
                  name="arrow-drop-down"
                  size={18}
                  color={appColors.white}
                />
              </RowComponent>
              {currentLocation && (
                <TextComponent
                  text={`${currentLocationName}`}
                  flex={0}
                  styles={{width: 230}}
                  numOfLine={1}
                  color={appColors.white}
                  font={fontFamilies.medium}
                  size={13}
                />
              )}
            </View>

            <CircleComponent
              onPress={() => dispatch(logout({}))}
              // onPress={() => {}}
              color={appColors.WhiteSmoke}
              size={36}>
              <View>
                <Logout
                  size={18}
                  color={appColors.DarkSlateGrayBlue4}
                  variant="Bold"
                />

                {unReadNotifications.length > 0 && (
                  <View
                    style={{
                      backgroundColor: appColors.DarkSlateGrayBlue4,
                      width: 10,
                      height: 10,
                      borderRadius: 4,
                      borderWidth: 2,
                      borderColor: '#524CE0',
                      position: 'absolute',
                      top: -2,
                      right: -2,
                    }}
                  />
                )}
              </View>
            </CircleComponent>
          </RowComponent>
          <SpaceComponent height={20} />

          <RowComponent justify="space-between">
            <TextComponent
              text={`Hello, ${
                current?.firstname.charAt(0).toUpperCase() +
                current?.firstname.slice(1)
              } ${
                current?.lastname.charAt(0).toUpperCase() +
                current?.lastname.slice(1)
              } `}
              size={20}
              font={fontFamilies.medium}
              color={appColors.white2}></TextComponent>
            <TagComponent
              bgColor={'#ECAB53'}
              onPress={() => navigation.navigate('Recharge')}
              label={current?.balence.toFixed(2).toString() + ' $'}
              icon={
                <CircleComponent size={20} color="#ECAB53">
                  <Moneys size="22" color="green" variant="Bold" />
                </CircleComponent>
              }
            />
          </RowComponent>
          <SpaceComponent height={20} />
        </View>
      </View>
      {/* </LinearGradient> */}
    </View>
  );
};

export default HomeScreen;
