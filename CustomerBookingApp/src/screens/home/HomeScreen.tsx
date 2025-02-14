// import GeoLocation from '@react-native-community/geolocation';
// import messaging from '@react-native-firebase/messaging';
import {useIsFocused} from '@react-navigation/native';
import axios from 'axios';
import {
  HambergerMenu,
  Location,
  Notification,
  SearchNormal1,
  Sort,
} from 'iconsax-react-native';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
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

const HomeScreen = ({navigation}: any) => {
  const [currentLocation, setCurrentLocation] = useState<AddressModel>();
  const [events, setEvents] = useState<EventModel[]>([]);
  const [nearbyEvents, setNearbyEvents] = useState<EventModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [eventData, setEventData] = useState<EventModel[]>([]);
  const [isOnline, setIsOnline] = useState<boolean>();
  const [unReadNotifications, setUnReadNotifications] = useState([]);
  const [isVibleModalLocation, setIsVibleModalLocation] = useState(false);

  const isFocused = useIsFocused();
  // const user = useSelector(authSelector);
  const dispatch = useDispatch<AppDispatch>();
  const {isLoggedIn, current} = useSelector((state: RootState) => state.user);

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

  // useEffect(() => {
  //   GeoLocation.getCurrentPosition(
  //     (position: any) => {
  //       if (position.coords) {
  //         reverseGeoCode({
  //           lat: position.coords.latitude,
  //           long: position.coords.longitude,
  //         });
  //       }
  //     },
  //     (error: any) => {
  //       console.log(error);
  //     },
  //     {},
  //   );

  //   getEvents();
  //   getEventsData();
  //   messaging().onMessage(async (mess: any) => {
  //     Toast.show({
  //       text1: mess.notification.title,
  //       text2: mess.notification.body,
  //       onPress: () => {
  //         const id = mess.data ? mess.data.eventId : '';
  //         id && navigation.navigate('EventDetail', {id});
  //       },
  //     });
  //   });

  //   messaging()
  //     .getInitialNotification()
  //     .then((mess: any) => {
  //       const id = mess && mess.data ? mess.data.id : '';
  //       id && handleLinking(`${appInfo.domain}/detail/${mess.data.id}`);
  //     });

  //   // checkNetWork();

  //   firestore()
  //     .collection('notifcation')
  //     .where('idRead', '==', false)
  //     .where('uid', '==', user.id)
  //     .onSnapshot(snap => {
  //       if (snap.empty) {
  //         setUnReadNotifications([]);
  //       } else {
  //         const items: any = [];

  //         snap.forEach(item =>
  //           items.push({
  //             id: item.id,
  //             ...item.data(),
  //           }),
  //         );

  //         setUnReadNotifications(items);
  //       }
  //     });
  // }, []);

  // useEffect(() => {
  //   getNearByEvents();
  // }, [currentLocation]);

  // useEffect(() => {
  //   if (isFocused) {
  //     getEvents();
  //     getNearByEvents();
  //   }
  // }, [isFocused]);

  // const checkNetWork = () => {
  //   NetInfo.addEventListener(state => {
  //     setIsOnline(state.isConnected ?? false);
  //   });
  // };

  // const getNearByEvents = () => {
  //   currentLocation &&
  //     currentLocation.position &&
  //     getEvents(currentLocation.position.lat, currentLocation.position.lng);
  // };

  const reverseGeoCode = async ({lat, long}: {lat: number; long: number}) => {
    // console.log(lat, long);

    const api = `https://rsapi.goong.io/Geocode?latlng=${lat},${long}&api_key=crMmofRW2lgZNiDMZtCUdYqHZfGZv1cVZ864e0CR`;

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

  // const getEvents = async (lat?: number, long?: number, distance?: number) => {
  //   const api = `${
  //     lat && long
  //       ? `/get-events?lat=${lat}&long=${long}&distance=${
  //           distance ?? 5
  //         }&limit=5&isUpcoming=true`
  //       : `/get-events?limit=5&isUpcoming=true`
  //   }`;

  //   if (events.length === 0 || nearbyEvents.length === 0) {
  //     setIsLoading(true);
  //   }
  //   try {
  //     const res: any = await eventAPI.HandleEvent(api);

  //     setIsLoading(false);
  //     res &&
  //       res.data &&
  //       (lat && long ? setNearbyEvents(res.data) : setEvents(res.data));
  //   } catch (error) {
  //     setIsLoading(false);
  //     console.log(`Get event error in home screen line 74 ${error}`);
  //   }
  // };

  // const getEventsData = async (
  //   lat?: number,
  //   long?: number,
  //   distance?: number,
  // ) => {
  //   const api = `/get-events`;
  //   try {
  //     const res = await eventAPI.HandleEvent(api);

  //     const data = res.data;

  //     const items: EventModel[] = [];

  //     data.forEach((item: any) => items.push(item));

  //     setEventData(items);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  useEffect(() => {
    const setTimeoutId = setTimeout(() => {
      if (isLoggedIn) dispatch(getCurrent());
    }, 300);

    return () => {
      clearTimeout(setTimeoutId);
    };
  }, [isLoggedIn]);

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
            {/* <RowComponent>
            <RowComponent
              styles={{flex: 1}}
              onPress={() => navigation.navigate('SearchEvents')}>
              <SearchNormal1
                variant="TwoTone"
                color={appColors.white}
                size={20}
              />
              <View
                style={{
                  width: 1,
                  backgroundColor: appColors.gray2,
                  marginHorizontal: 10,
                  height: 20,
                }}
              />
              <TextComponent
                flex={1}
                text="Search..."
                color={appColors.gray2}
                size={16}
              />
            </RowComponent>
            <TagComponent
              bgColor={'#5D56F3'}
              onPress={() =>
                navigation.navigate('SearchEvents', {isFilter: true})
              }
              label="Filters"
              icon={
                <CircleComponent size={20} color="#B1AEFA">
                  <Sort size={16} color="#5D56F3" />
                </CircleComponent>
              }
            />
          </RowComponent> */}
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
              height: 95,
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
              height: '45%',
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
          <RowComponent
            justify="center"
            styles={{
              alignItems: 'center',
              height: '43%',
              paddingHorizontal: 5,
            }}>
            <CategoriesList isFill />
          </RowComponent>
        </View>
      </SectionComponent>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={[
          {
            flex: 1,
            // backgroundColor: 'coral',
            // marginTop: Platform.OS === 'ios' ? 22 : 18,
            marginTop: 10,
          },
        ]}>
        <SectionComponent
          styles={{
            height: 110,
            // backgroundColor: 'black',
            justifyContent: 'center',
            // alignItems: 'center',
            // marginTop: 10,
            paddingBottom: 0,
          }}>
          <RowComponent justify="flex-start" styles={{flex: 1}}>
            {data.itemBookingHomeData.map(e => (
              <View key={e.id} style={{width: '35%'}}>
                <ItemBookingHome data={e}></ItemBookingHome>
              </View>
            ))}
          </RowComponent>
        </SectionComponent>
        {/* <SectionComponent styles={{paddingHorizontal: 0, paddingTop: 24}}>
          <TabBarComponent
            title="Upcoming Events"
            onPress={() =>
              navigation.navigate('ExploreEvents', {
                key: 'upcoming',
                title: 'Upcoming Events',
              })
            }
          />
          {events.length > 0 ? (
            <FlatList
              showsHorizontalScrollIndicator={false}
              horizontal
              data={events}
              renderItem={({item, index}) => (
                <EventItem key={`event${index}`} item={item} type="card" />
              )}
            />
          ) : (
            <LoadingComponent isLoading={isLoading} values={events.length} />
          )}
        </SectionComponent> */}

        {/* mẫu */}
        <SectionComponent styles={{paddingHorizontal: 0, paddingTop: 24}}>
          <TabBarComponent title="Upcoming Events" onPress={() => {}} />
          <FlatList
            showsHorizontalScrollIndicator={false}
            horizontal
            data={Array.from({length: 5})}
            renderItem={({item, index}) => (
              <EventItem key={`event${index}`} item={itemEvent} type="card" />
            )}
          />
        </SectionComponent>

        <SectionComponent>
          <ImageBackground
            source={require('../../assets/images/invite-image.png')}
            style={{flex: 1, padding: 16, minHeight: 127}}
            imageStyle={{
              resizeMode: 'cover',
              borderRadius: 12,
            }}>
            <TextComponent text="Invite your friends" title />
            <TextComponent text="Get $20 for ticket" />

            <RowComponent justify="flex-start">
              <TouchableOpacity
                onPress={() => console.log('fafafa')}
                style={[
                  globalStyles.button,
                  {
                    marginTop: 12,
                    backgroundColor: '#00F8FF',
                    paddingHorizontal: 28,
                  },
                ]}>
                <TextComponent
                  text="INVITE"
                  font={fontFamilies.bold}
                  color={appColors.white}
                />
              </TouchableOpacity>
            </RowComponent>
          </ImageBackground>
        </SectionComponent>
        {/* <SectionComponent styles={{paddingHorizontal: 0, paddingTop: 24}}>
          <TabBarComponent
            title="Nearby You"
            onPress={() =>
              navigation.navigate('ExploreEvents', {
                key: 'nearby',
                title: 'Nearby You',
              })
            }
          />
          {nearbyEvents.length > 0 ? (
            <FlatList
              showsHorizontalScrollIndicator={false}
              horizontal
              data={nearbyEvents}
              renderItem={({item, index}) => (
                <EventItem key={`event${index}`} item={item} type="card" />
              )}
            />
          ) : (
            <LoadingComponent
              isLoading={isLoading}
              values={nearbyEvents.length}
            />
          )}
        </SectionComponent> */}
      </ScrollView>

      {/* <ModalLocationBooking
        visible={isVibleModalLocation}
        onClose={() => setIsVibleModalLocation(false)}
        onSelect={val => {
          // setAddressSelected(val);
          // onSelect(val);
        }}
      /> */}

      {/* <Modal animationType="fade" style={[{flex: 1}]} visible={!isOnline}>
        <View style={[globalStyles.center, {flex: 1}]}>
          <Text>Network error</Text>
        </View>
      </Modal> */}
    </View>
  );
};

export default HomeScreen;
