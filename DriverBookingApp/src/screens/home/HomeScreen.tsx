import {
  View,
  Text,
  Button,
  Platform,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../stores/redux';
import {logout, setCurrentLocation} from '../../stores/users/userSlide';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import {apiAllBillDriver, apiUpdateLocationDriver} from '../../apis';
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
  Star1,
} from 'iconsax-react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {fontFamilies} from '../../constants/fontFamilies';
import {StatusBar} from 'react-native';
import {StyleSheet} from 'react-native';
import {Bank, ArrowSwapHorizontal, Gift, Receipt2} from 'iconsax-react-native';
import HomeFeatureCard from '../../components/HomeFeatureCard';
import {useFocusEffect} from '@react-navigation/native';
import {IBill} from '../../models/BillModel';

const HomeScreen = ({navigation}: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const {isLoggedIn, current, currentLocation} = useSelector(
    (state: RootState) => state.user,
  );

  const [unReadNotifications, setUnReadNotifications] = useState([]);
  const [currentLocationName, setCurrentLocationName] = useState();
  const [completedCount, setCompletedCount] = useState(0);

  const reverseGeoCode = async ({lat, long}: {lat: number; long: number}) => {
    const api = `https://rsapi.goong.io/Geocode?latlng=${lat},${long}&api_key=2DLy46ZYuWyvfB4l7sgWTFLiahpq7h0TH5vnC6ES`;

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

  const fetchData = async () => {
    try {
      const response = await apiAllBillDriver();
      const completedBills = response.data.filter(
        (bill: IBill) => bill.status === 'COMPLETED',
      );

      setCompletedCount(completedBills.length);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, []),
  );

  useEffect(() => {
    const setTimeoutId = setTimeout(() => {
      if (isLoggedIn) dispatch(getCurrent());
    }, 300);

    return () => {
      clearTimeout(setTimeoutId);
    };
  }, [isLoggedIn]);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      (position: any) => {
        if (position.coords) {
          // console.log(position.coords);
          reverseGeoCode({
            lat: position.coords.latitude,
            long: position.coords.longitude,
          });
        }
      },
      (error: any) => {
        console.log(error);
      },
      // {maximumAge: 0, timeout: 30000, enableHighAccuracy: true},
      {},
    );
  }, []);

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
      {enableHighAccuracy: true, distanceFilter: 50, interval: 5000},
    );
    return () => Geolocation.clearWatch(watchId);
  }, []);

  return (
    <View style={[globalStyles.container]}>
      <StatusBar barStyle={'dark-content'} />

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

          <RowComponent justify="space-between" styles={{marginTop: 10}}>
            <TextComponent
              text={`Hello, ${
                current?.firstname.charAt(0).toUpperCase() +
                current?.firstname.slice(1)
              } ${
                current?.lastname.charAt(0).toUpperCase() +
                current?.lastname.slice(1)
              } `}
              size={20}
              styles={{marginLeft: 10}}
              font={fontFamilies.medium}
              color={appColors.white2}></TextComponent>
            <TagComponent
              bgColor={'#ECAB53'}
              // onPress={() => navigation.navigate('Recharge')}
              label={current?.totalRating.toFixed(2).toString()}
              icon={
                <CircleComponent size={20} color="#ECAB53">
                  {/* <Moneys size="22" color="green" variant="Bold" /> */}
                  <Star1 size="22" color="yellow" variant="Bold" />
                </CircleComponent>
              }
            />
          </RowComponent>
          <SpaceComponent height={20} />
        </View>
      </View>
      {/* </LinearGradient> */}
      {/* Phần giao diện bên dưới */}
      <View
        style={{
          padding: 16,
          paddingTop: 5,
          paddingBottom: 10,
        }}>
        <View style={styles.accountRow}>
          <View style={styles.accountBox}>
            <View
              style={{
                backgroundColor: appColors.link,
                height: 80,
                borderRadius: 100,
                aspectRatio: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TextComponent
                text={completedCount.toString()}
                size={35}
                font={fontFamilies.bold}
                styles={{textAlign: 'center'}} // Thêm dòng này
                color={appColors.WhiteSmoke}></TextComponent>
              <TextComponent
                text="Trip"
                size={13}
                color={appColors.WhiteSmoke}
                font={fontFamilies.bold}></TextComponent>
            </View>
            <View
              style={{
                marginRight: 0,
                paddingRight: 10,
                flex: 1,
                height: 80,
                borderRadius: 14,
                borderTopLeftRadius: 50,
                borderBottomLeftRadius: 50,
                borderBottomRightRadius: 60,
                backgroundColor: appColors.link,
                display: 'flex',
                paddingLeft: 50,
                alignItems: 'flex-start',
                justifyContent: 'center',
              }}>
              <RowComponent justify="flex-end">
                <View>
                  <RowComponent styles={{marginBottom: 0}}>
                    <CircleComponent color={appColors.WhiteSmoke} size={36}>
                      <View>
                        <Moneys
                          size="30"
                          color={appColors.DarkSlateGrayBlue4}
                          variant="Bold"
                        />
                      </View>
                    </CircleComponent>
                    <SpaceComponent width={20} />
                    <TextComponent
                      text={`${current?.balence.toFixed(3)}`}
                      font={fontFamilies.semiBold}
                      size={35}
                      color={appColors.WhiteSmoke}
                      styles={{marginBottom: 2}}
                    />

                    {/* <Moneys size="30" color="#ECAB53" variant="Bold" /> */}
                  </RowComponent>
                  <TextComponent
                    text="Your wallet balance"
                    size={13}
                    color={appColors.WhiteSmoke}
                    font={fontFamilies.medium}></TextComponent>
                </View>
              </RowComponent>
            </View>
          </View>
        </View>
        <View style={styles.row}>
          <HomeFeatureCard
            icon={<Receipt2 size={28} color="#F76B6A" variant="Bold" />}
            title="Dashboard"
            subtitle="Expense management"
            color="#FDE8E4"
            subtitleColor="#F76B6A"
            iconCircleColor="#F9CFC7"
            onPress={() => navigation.navigate('Dashboard')}
          />
          <HomeFeatureCard
            icon={<Gift size={28} color="#8B5CF6" variant="Bold" />}
            title="Recharge"
            subtitle="Top up your wallet"
            color="#F3F0FA"
            subtitleColor="#8B5CF6"
            iconCircleColor="#E2D6FA"
            onPress={() => navigation.navigate('Recharge')}
          />
        </View>
        <View style={styles.row}>
          <HomeFeatureCard
            icon={<Bank size={28} color="#34A853" variant="Bold" />}
            title="Map view"
            subtitle="See map"
            color="#E7F6EF"
            subtitleColor="#34A853"
            iconCircleColor="#BFE7D0"
            onPress={() => navigation.navigate('MapView')}
          />
          <HomeFeatureCard
            icon={
              <ArrowSwapHorizontal size={28} color="#4285F4" variant="Bold" />
            }
            title="History"
            subtitle="View shipping history"
            color="#EAF1FB"
            subtitleColor="#4285F4"
            iconCircleColor="#C7DBF9"
            onPress={() => navigation.navigate('HistoryScreen')}
          />
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
    marginBottom: 30,
    // paddingHorizontal: 8,
  },
  accountBox: {
    flex: 1,
    backgroundColor: '#B2D9EA',
    borderRadius: 14,
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 60,
    padding: 8,
    display: 'flex',
    gap: 20,
    flexDirection: 'row',

    // marginHorizontal: 6,
    alignItems: 'center',
    elevation: 1,
  },
});

export default HomeScreen;
