// import GeoLocation from '@react-native-community/geolocation';
// import messaging from '@react-native-firebase/messaging';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import axios from 'axios';
import {
  HambergerMenu,
  Location,
  Notification,
  SearchNormal1,
  Sort,
} from 'iconsax-react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Toast from 'react-native-toast-message';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import eventAPI from '../../apis/eventApi';
import {
  ButtonComponent,
  CategoriesList,
  CircleComponent,
  EventItem,
  ItemBookingHome,
  ItemOrderPending,
  LoadingComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TabBarComponent,
  TagComponent,
  TextComponent,
} from '../../components';
import {appColors} from '../../constants/appColors';
import {fontFamilies} from '../../constants/fontFamilies';
import {AddressModel} from '../../models/AddressModel';
import {EventModel} from '../../models/EventModel';
import {globalStyles} from '../../styles/globalStyles';
// import {handleLinking} from '../../utils/handleLinking';
// import NetInfo from '@react-native-community/netinfo';
// import firestore from '@react-native-firebase/firestore';
import {useDispatch, useSelector} from 'react-redux';
// import {authSelector} from '../../redux/reducers/authReducer';
import {appInfo} from '../../constants/appInfos';
import {logout} from '../../stores/users/userSlide';
import {AppDispatch, RootState} from '../../stores/redux';
import {getCurrent} from '../../stores/users/asyncAction';
import Geolocation from '@react-native-community/geolocation';
import LinearGradient from 'react-native-linear-gradient';
import data from '../../constants/data';
import ModalLocationBooking from '../../modals/modalSelectLocation/ModalLocationBooking';
import {apiGetBillsPending} from '../../apis';
import socket from '../../apis/socket';
import MapLibreGL from '@maplibre/maplibre-react-native';

const loadMap =
  'https://tiles.goong.io/assets/goong_map_web.json?api_key=K4Wf0bYa0I5v8wxWCjRmeohWKjmHaHr9j2jwfImc';

const HomeScreen = ({navigation}: any) => {
  const [currentLocation, setCurrentLocation] = useState<AddressModel>();
  const [events, setEvents] = useState<EventModel[]>([]);
  const [nearbyEvents, setNearbyEvents] = useState<EventModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [eventData, setEventData] = useState<EventModel[]>([]);
  const [isOnline, setIsOnline] = useState<boolean>();
  const [unReadNotifications, setUnReadNotifications] = useState([]);
  const [isVibleModalLocation, setIsVibleModalLocation] = useState(false);
  const [listOrderPending, setListOrderPending] = useState<any[]>([]);
  const [centerCoords, setCenterCoords] = useState<{
    latitude: number;
    longitude: number;
  }>({
    latitude: 20.980216,
    longitude: 105.772607,
  });

  const cameraRef = useRef<MapLibreGL.CameraRef>(null);
  const mapRef = useRef<MapLibreGL.MapViewRef>(null);

  const isFocused = useIsFocused();
  // const user = useSelector(authSelector);
  const dispatch = useDispatch<AppDispatch>();
  const {isLoggedIn, current} = useSelector((state: RootState) => state.user);

  // console.log(listOrderPending);

  // mẫu
  const itemEvent = {
    title: 'International Band Music Concert',
    description:
      'Enjoy your favorite dishe and a lovely your friends and family and have a great time. Food from local food trucks will be available for purchase.',
    location: {
      title: 'Gala Convention Center',
      address: '36 Guild Street London, UK',
    },
    imageUrl: '',
    users: [''],
    authorId: '',
    startAt: Date.now(),
    endAt: Date.now(),
    date: Date.now(),
  };

  const fetchBillsPending = async () => {
    const rs = await apiGetBillsPending();
    setListOrderPending(rs.data.bills);
  };

  useFocusEffect(
    useCallback(() => {
      fetchBillsPending();
    }, []),
  );

  useEffect(() => {
    Geolocation.getCurrentPosition(
      (position: any) => {
        if (position.coords) {
          // console.log(position.coords);
          reverseGeoCode({
            lat: position.coords.latitude,
            long: position.coords.longitude,
          });
          cameraRef.current?.setCamera({
            centerCoordinate: [
              position.coords.longitude,
              position.coords.latitude,
            ],
            animationDuration: 1000, // Di chuyển mượt
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

  const reverseGeoCode = async ({lat, long}: {lat: number; long: number}) => {
    // console.log(lat, long);

    const api = `https://rsapi.goong.io/Geocode?latlng=${lat},${long}&api_key=sJrvIqiCKE2h7akqUhzs1gyVqt5PiCURtoVihCjg`;

    try {
      const res = await axios.get(api);

      if (res && res.status === 200 && res.data.results[0]) {
        const items = res.data.results[0].address;
        setCurrentLocation(items);
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
    socket.on('notice-cancle-order-from-driver', data => {
      fetchBillsPending();
    });
    socket.on('notice-arrival-at-pick-up-point', data => {
      fetchBillsPending();
    });
  }, []);

  // console.log(currentLocation);

  return (
    <View style={[globalStyles.container]}>
      <StatusBar barStyle={'light-content'} />
      <LinearGradient colors={[appColors.primary, 'rgba(42, 31, 197, 0)']}>
        <View
          style={{
            // backgroundColor: appColors.primary,
            // height: Platform.OS === 'android' ? 168 : 182,
            // height: 182,
            height: 210,
            borderBottomLeftRadius: 40,
            borderBottomRightRadius: 40,
            paddingTop:
              Platform.OS === 'android' ? StatusBar.currentHeight : 52,
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
                    text={`${currentLocation}`}
                    flex={0}
                    color={appColors.white}
                    font={fontFamilies.medium}
                    size={13}
                  />
                )}
              </View>

              <CircleComponent
                onPress={() => dispatch(logout({}))}
                // onPress={() => navigation.navigate('NotificationsScreen')}
                color="#524CE0"
                size={36}>
                <View>
                  <Notification size={18} color={appColors.white} />
                  {unReadNotifications.length > 0 && (
                    <View
                      style={{
                        backgroundColor: '#02E9FE',
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
                bgColor={'#5D56F3'}
                onPress={() =>
                  navigation.navigate('SearchEvents', {isFilter: true})
                }
                label="489"
                icon={
                  <CircleComponent size={20} color="#B1AEFA">
                    <Sort size={16} color="#5D56F3" />
                  </CircleComponent>
                }
              />
            </RowComponent>
            <SpaceComponent height={20} />
          </View>

          {/* <View style={{marginBottom: -16}}>
          <CategoriesList isFill />
        </View> */}
        </View>
      </LinearGradient>
      <SectionComponent styles={{marginTop: -85}}>
        <View
          style={[
            globalStyles.shadow,
            {
              backgroundColor: appColors.white,
              // height: 95,
              height: 60,
              borderWidth: 0.5,
              borderColor: appColors.gray3,
              borderRadius: 12,
            },
          ]}>
          <RowComponent
            justify="flex-start"
            // onPress={() => setIsVibleModalLocation(true)}
            onPress={() => navigation.navigate('ScreenLocationBooking')}
            styles={{
              backgroundColor: appColors.WhiteSmoke,
              // flex: 1,
              // height: '45%',
              height: '86%',
              borderRadius: 12,
              margin: 4,
              paddingLeft: 15,
            }}>
            <Location variant="Bold" size="22" color="#FF8A65" />
            <TextComponent
              styles={{marginLeft: 10}}
              font={fontFamilies.medium}
              text="Where do you want to go?"></TextComponent>
          </RowComponent>
        </View>
      </SectionComponent>

      <SectionComponent
        styles={{
          height: 110,
          // backgroundColor: 'black',
          justifyContent: 'center',
          // alignItems: 'center',
          // marginTop: 10,
          paddingBottom: 0,
        }}>
        <RowComponent justify="space-between" styles={{flex: 1}}>
          {data.itemBookingHomeData.map(e => (
            <View key={e.id} style={{width: '25%'}}>
              <ItemBookingHome data={e}></ItemBookingHome>
            </View>
          ))}
        </RowComponent>
      </SectionComponent>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={[
          {
            flex: 1,
            // backgroundColor: 'coral',
            // marginTop: Platform.OS === 'ios' ? 22 : 18,
            // marginTop: 10,
          },
        ]}>
        <View
          style={{
            marginTop: 5,
            maxHeight: 85,
            // width: '92%',
            borderWidth: 0.2,
            borderColor: '#EED5D2',
            backgroundColor: '#F8F8FF',

            // margin: 'auto',
            padding: 5,
            // borderRadius: 10,
          }}>
          <FlatList
            data={listOrderPending}
            showsHorizontalScrollIndicator={false}
            horizontal
            style={[globalStyles.shadow]}
            contentContainerStyle={{
              alignItems: 'center',
              justifyContent: 'center',
            }}
            renderItem={({item, index}) => (
              <View
                style={{
                  // width: 300,
                  justifyContent: 'center',
                  paddingHorizontal: 5,
                  // backgroundColor: 'green',
                }}>
                <ItemOrderPending item={item}></ItemOrderPending>
              </View>
            )}
          />
        </View>
        {/* </SectionComponent> */}
        <SectionComponent styles={{paddingHorizontal: 0, paddingTop: 20}}>
          <TabBarComponent title="Upcoming Events" onPress={() => {}} />
          <View
            style={{
              marginTop: 10,
              // maxHeight: 85,
              // width: '92%',
              borderWidth: 0.2,
              borderColor: '#EED5D2',
              backgroundColor: '#F8F8FF',

              // margin: 'auto',
              padding: 5,
              // borderRadius: 10,
            }}>
            <FlatList
              showsHorizontalScrollIndicator={false}
              horizontal
              data={Array.from({length: 5})}
              renderItem={({item, index}) => (
                <EventItem key={`event${index}`} item={itemEvent} type="card" />
              )}
            />
          </View>
        </SectionComponent>

        <TextComponent
          text="Current location"
          styles={{marginBottom: 5, paddingHorizontal: 16, marginTop: 10}}
          title
          flex={1}
          size={16}
        />

        <View
          style={{
            height: 190,
            padding: 5,
            backgroundColor: appColors.gray2,
            marginTop: 10,
          }}>
          <MapLibreGL.MapView
            styleURL={loadMap}
            style={{flex: 1}}
            ref={mapRef}
            zoomEnabled={false} // Tắt zoom
            scrollEnabled={false} // Tắt cuộn (di chuyển bản đồ)
            rotateEnabled={false} // Tắt xoay bản đồ
            pitchEnabled={false} // Tắt thay đổi góc nhìn
            onPress={() => console.log('Map Pressed')}>
            <MapLibreGL.Camera
              ref={cameraRef}
              animationDuration={0}
              centerCoordinate={[105.772607, 20.980216]}
              zoomLevel={11}
            />
            <MapLibreGL.UserLocation />
          </MapLibreGL.MapView>
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
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
