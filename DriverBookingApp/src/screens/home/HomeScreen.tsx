import {
  View,
  Text,
  Button,
  Platform,
  TouchableOpacity,
  Image,
} from 'react-native';
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
import {StyleSheet} from 'react-native';
import {Bank, ArrowSwapHorizontal, Gift, Receipt2} from 'iconsax-react-native';

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
      {/* Phần giao diện bên dưới */}
      <View style={{padding: 16, paddingBottom: 10}}>
        <View style={styles.accountRow}>
          <View style={styles.accountBox}>
            <TextComponent
              text="$12,939.25"
              font={fontFamilies.semiBold}
              size={22}
              color="#222"
              styles={{marginBottom: 2}}
            />
            <TextComponent
              text="Checking Account"
              size={13}
              color="#888"
              styles={{marginBottom: 0}}
            />
            <TextComponent text="Balance" size={12} color="#bbb" />
          </View>
          <View style={styles.accountBox}>
            <TextComponent
              text="$100,203.32"
              font={fontFamilies.semiBold}
              size={22}
              color="#222"
              styles={{marginBottom: 2}}
            />
            <TextComponent
              text="Savings Account"
              size={13}
              color="#888"
              styles={{marginBottom: 0}}
            />
            <TextComponent text="Balance" size={12} color="#bbb" />
          </View>
        </View>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.card, {backgroundColor: '#FDE8E4'}]}
            onPress={() => {
              /* Xử lý khi nhấn Bill Pay */
            }}>
            <View style={styles.iconCircle}>
              <Receipt2 size={28} color="#F76B6A" variant="Bold" />
            </View>
            <TextComponent
              text="Dashboard"
              font={fontFamilies.semiBold}
              size={18}
            />
            <TextComponent
              text="Expense management"
              size={14}
              color="#F76B6A"
              font={fontFamilies.medium}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.card, {backgroundColor: '#F3F0FA'}]}
            onPress={() => {
              navigation.navigate('Recharge');
            }}>
            <View style={styles.iconCircle}>
              <Gift size={28} color="#8B5CF6" variant="Bold" />
            </View>
            <TextComponent
              text="Recharge"
              font={fontFamilies.semiBold}
              size={18}
            />
            <TextComponent
              text="Top up your wallet"
              size={14}
              color="#8B5CF6"
              font={fontFamilies.medium}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.card, {backgroundColor: '#E7F6EF'}]}
            onPress={() => {
              /* Xử lý khi nhấn Statement */
            }}>
            <View style={styles.iconCircle}>
              <Bank size={28} color="#34A853" variant="Bold" />
            </View>
            <TextComponent
              text="Map view"
              font={fontFamilies.semiBold}
              size={18}
            />
            <TextComponent
              text="See map"
              size={14}
              color="#34A853"
              font={fontFamilies.medium}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.card, {backgroundColor: '#EAF1FB'}]}
            onPress={() => {
              navigation.navigate('Message');
            }}>
            <View style={styles.iconCircle}>
              <ArrowSwapHorizontal size={28} color="#4285F4" variant="Bold" />
            </View>
            <TextComponent
              text="Messages"
              font={fontFamilies.semiBold}
              size={18}
            />
            <TextComponent
              text="Exchange messages"
              size={14}
              color="#4285F4"
              font={fontFamilies.medium}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          alignItems: 'center',
          width: '100%',
        }}>
        <Image
          source={require('../../assets/images/banner-home.png')} // ✅ Không dùng uri
          style={{
            width: 180,
            height: 180,

            padding: 10,
            borderRadius: 12,
            resizeMode: 'contain',
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  card: {
    flex: 1,
    borderRadius: 18,
    // padding: 20, // tăng padding
    paddingVertical: 20, // tăng chiều cao của card
    minHeight: 120, // tăng chiều cao tối thiểu
    marginHorizontal: 6,
    alignItems: 'center',
    elevation: 2,
  },
  iconCircle: {
    backgroundColor: '#fff',
    borderRadius: 24,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16, // tăng khoảng cách
    elevation: 1,
  },
  accountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
    marginBottom: 18,
    paddingHorizontal: 8,
  },
  accountBox: {
    flex: 1,
    backgroundColor: '#F6F6F6',
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 6,
    alignItems: 'flex-start',
    elevation: 1,
  },
});

export default HomeScreen;
