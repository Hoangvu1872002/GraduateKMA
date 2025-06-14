import {View, Text, StatusBar, Image, Modal, Linking} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {IBillTemporary} from '../../models/SelectModel';
import {FeatureCollection, Feature, LineString, Point} from 'geojson';
import MapLibreGL from '@maplibre/maplibre-react-native';
import axios from 'axios';
import {
  ButtonComponent,
  CardComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '../../components';
import {globalStyles} from '../../styles/globalStyles';
// import {styles} from './ModalMapLocation.styles';
import {appColors} from '../../constants/appColors';
import {
  ArrowCircleLeft2,
  Call,
  Location,
  MessageText1,
  Moneys,
} from 'iconsax-react-native';
import {fontFamilies} from '../../constants/fontFamilies';
import {BottomSheetModalProvider, BottomSheetView} from '@gorhom/bottom-sheet';
import BottomSheet from '@gorhom/bottom-sheet';
import {styles} from './ModalMapLocation.styles';
import Geolocation from '@react-native-community/geolocation';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../stores/redux';
import {apiUpdateBalenceDriver, apiUpdateStatusBill} from '../../apis';
import socket from '../../apis/socket';
import {setOrderPending} from '../../stores/users/userSlide';
import {getCurrent} from '../../stores/users/asyncAction';
import Toast from 'react-native-toast-message';

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface PointFeature extends FeatureCollection {
  features: {
    type: 'Feature';
    geometry: Point;
    properties: {icon: string};
  }[];
}

MapLibreGL.setAccessToken(null); // Goong sử dụng API Key riêng
MapLibreGL.setConnected(true);

const pickupIcon = require('../../assets/images/ic_map_ic_pick.png');
const destinationIcon = require('../../assets/images/icons_pickupmarker.png');
const bikeIcon = require('../../assets/images/img_vespa_top.png');
const carIcon = require('../../assets/images/car.png');
const currentLocationFlag = require('../../assets/images/flag_current.png');

const loadMap =
  'https://tiles.goong.io/assets/goong_map_web.json?api_key=WKhuQZ3GCrTsAv9fvPSn0BHu0kc0NfgD1UAwZrcQ';

const DirectionsMapScreen = ({navigation, route}: any) => {
  const {data}: {data: IBillTemporary} = route?.params || {};
  const {pickupAddress, destinationAddress, _id} = data;
  console.log(data);

  // console.log(data);

  const {currentLocation, orderPending} = useSelector(
    (state: RootState) => state.user,
  );

  const dispatch = useDispatch<AppDispatch>();

  // console.log(currentLocation);

  const cameraRef = useRef<MapLibreGL.CameraRef | null>(null);
  const mapRef = useRef<MapLibreGL.MapViewRef>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [geoJSONDataCustomer, setGeoJSONDataCustomer] =
    useState<FeatureCollection<LineString> | null>(null);
  const [geoJSONData, setGeoJSONData] =
    useState<FeatureCollection<LineString> | null>(null);
  const [geoJSONPoints, setGeoJSONPoints] = useState<PointFeature | null>(null);
  const [geoJSONCurrentPoints, setGeoJSONCurrentPoints] =
    useState<PointFeature | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(15);
  const [statusArrived, setStatusArrived] = useState(false);
  const [distanceToDestination, setDistanceToDestination] =
    useState<string>('');
  const [isWarningModalVisible, setIsWarningModalVisible] = useState(false);
  const [isSkipTripModalVisible, setIsSkipTripModalVisible] = useState(false);
  const [statusOrder, setStatusOrder] = useState(2);

  const decodePolyline = (encoded: string) => {
    let points = [];
    let index = 0,
      lat = 0,
      lng = 0;

    while (index < encoded.length) {
      let b,
        shift = 0,
        result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      points.push([lng * 1e-5, lat * 1e-5]);
    }

    return points;
  };

  const getPointData = (
    pickup: Coordinates,
    destination: Coordinates,
    currentLocation: Coordinates,
  ): PointFeature => ({
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [pickup.longitude, pickup.latitude], // Chuyển thành [lng, lat]
        },
        properties: {icon: 'pickupIcon'},
      },
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [destination.longitude, destination.latitude],
        },
        properties: {icon: 'destinationIcon'},
      },
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [currentLocation.longitude, currentLocation.latitude],
        },
        properties: {icon: 'currentLocationFlag'},
      },
    ],
  });

  const getCurrentPointData = ({
    latitude,
    longitude,
  }: {
    latitude: number;
    longitude: number;
  }): PointFeature => ({
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [longitude, latitude], // Chuyển thành [lng, lat]
        },
        properties: {icon: 'bikeIcon'},
      },
    ],
  });

  const fetchRouteCustomer = async () => {
    try {
      const responseCustomer = await axios.get(
        'https://rsapi.goong.io/Direction',
        {
          params: {
            origin: `${pickupAddress.latitude},${pickupAddress.longitude}`,
            destination: `${destinationAddress.latitude},${destinationAddress.longitude}`,
            vehicle: 'bike',
            api_key: 'crMmofRW2lgZNiDMZtCUdYqHZfGZv1cVZ864e0CR',
          },
        },
      );

      const routeCustomer =
        responseCustomer.data.routes[0].overview_polyline.points;

      const decodedRouteCustomer = decodePolyline(routeCustomer); // Giải mã polyline

      const dataCustomer: FeatureCollection<LineString> = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: decodedRouteCustomer,
            },
            properties: {},
          },
        ],
      };

      setGeoJSONDataCustomer(dataCustomer);

      // Lấy quãng đường và thời gian từ API

      setTimeout(async () => {
        await cameraRef.current?.fitBounds(
          [currentLocation.longitude ?? 0, currentLocation.latitude ?? 0],
          [pickupAddress.longitude ?? 0, pickupAddress.latitude ?? 0],
          [170, 50, 380, 50],
          0,
        );
        await cameraRef.current?.setCamera({
          animationDuration: 0, // Không animation để tránh dịch chuyển
        });
      }, 500);
    } catch (error) {
      console.error('Error fetching route:', error);
    }
  };

  const fetchDisDriver = async () => {
    const responseDriver = await axios.get('https://rsapi.goong.io/Direction', {
      params: {
        origin: `${currentLocation.latitude},${currentLocation.longitude}`,
        destination: `${pickupAddress.latitude},${pickupAddress.longitude}`,
        vehicle: 'bike',
        api_key: '2DLy46ZYuWyvfB4l7sgWTFLiahpq7h0TH5vnC6ES',
      },
    });

    const routeDriver = responseDriver.data.routes[0].overview_polyline.points;
    const decodedRouteDriver = decodePolyline(routeDriver);
    const dataDriver: FeatureCollection<LineString> = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: decodedRouteDriver,
          },
          properties: {},
        },
      ],
    };
    setGeoJSONData(dataDriver);

    const distance = responseDriver.data.routes[0].legs[0].distance.text;

    setDistanceToDestination(distance); // Lưu quãng đường
  };

  const fetchDisCustomer = async () => {
    const responseCustomer = await axios.get(
      'https://rsapi.goong.io/Direction',
      {
        params: {
          origin: `${currentLocation.latitude},${currentLocation.longitude}`,
          destination: `${destinationAddress.latitude},${destinationAddress.longitude}`,
          vehicle: 'bike',
          api_key: '2DLy46ZYuWyvfB4l7sgWTFLiahpq7h0TH5vnC6ES',
        },
      },
    );

    const routeCustomer =
      responseCustomer.data.routes[0].overview_polyline.points;

    const decodedRouteCustomer = decodePolyline(routeCustomer); // Giải mã polyline

    const dataCustomer: FeatureCollection<LineString> = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: decodedRouteCustomer,
          },
          properties: {},
        },
      ],
    };

    setGeoJSONData(dataCustomer);

    // Lấy quãng đường và thời gian từ API
    const distance = responseCustomer.data.routes[0].legs[0].distance.text;

    setDistanceToDestination(distance); // Lưu quãng đường
  };

  useEffect(() => {
    if (statusOrder === 2) {
      fetchDisDriver();
    } else if (statusOrder === 3) {
      fetchDisCustomer();
    }
  }, [currentLocation]);

  useEffect(() => {
    fetchRouteCustomer();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (
        pickupAddress.latitude &&
        pickupAddress.longitude &&
        destinationAddress.latitude &&
        destinationAddress.longitude
      ) {
        const pointData = getPointData(
          {
            latitude: pickupAddress.latitude,
            longitude: pickupAddress.longitude,
          },
          {
            latitude: destinationAddress.latitude,
            longitude: destinationAddress.longitude,
          },
          {
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
          },
        );

        setGeoJSONPoints(pointData);
      }
    }, 500);
  }, [pickupAddress, destinationAddress]);

  useEffect(() => {
    setTimeout(() => {
      const pointData = getCurrentPointData({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      });
      setGeoJSONCurrentPoints(pointData);
      cameraRef.current?.setCamera({
        centerCoordinate: [currentLocation.longitude, currentLocation.latitude],
        animationDuration: 1000, // Di chuyển mượt
      });
    }, 500);
  }, [currentLocation]);

  const handleSkipTrip = async () => {
    await apiUpdateBalenceDriver({cost: data.cost * 0.3}); // Giả sử bạn muốn trừ 30% tiền từ tài khoản của người lái xe
    dispatch(getCurrent());
    socket.emit('notice-cancle-order-from-driver', orderPending._id);
    dispatch(setOrderPending({}));
    navigation.goBack();
  };

  const [hasShownPickupToast, setHasShownPickupToast] = useState(false);
  const [hasShownDestinationToast, setHasShownDestinationToast] =
    useState(false);

  useEffect(() => {
    let distanceInMeters = 0;
    if (distanceToDestination.includes('km')) {
      distanceInMeters =
        parseFloat(distanceToDestination.replace(' km', '')) * 1000;
    } else if (distanceToDestination.includes('m')) {
      distanceInMeters = parseFloat(distanceToDestination.replace(' m', ''));
    }

    // Near pickup point (statusOrder === 2)
    if (
      statusOrder === 2 &&
      distanceInMeters > 0 &&
      distanceInMeters <= 200 &&
      !hasShownPickupToast
    ) {
      Toast.show({
        type: 'error',
        text1: 'You are close to the pickup point',
        text2: 'Please update the order status when you arrive!',
        position: 'top',
        visibilityTime: 4000,
      });
      setHasShownPickupToast(true);
    }

    // Near destination (statusOrder === 3)
    if (
      statusOrder === 3 &&
      distanceInMeters > 0 &&
      distanceInMeters <= 200 &&
      !hasShownDestinationToast
    ) {
      Toast.show({
        type: 'error',
        text1: 'You are close to the destination',
        text2: 'Please update the order status when you arrive!',
        position: 'top',
        visibilityTime: 4000,
      });
      setHasShownDestinationToast(true);
    }
  }, [distanceToDestination]);

  return (
    <View style={{flex: 1, position: 'relative'}}>
      <StatusBar
        barStyle="dark-content"
        translucent={true}
        backgroundColor="transparent"
      />
      <View>
        <Modal
          visible={isWarningModalVisible}
          transparent={true}
          animationType="fade"
          statusBarTranslucent={true}
          onRequestClose={() => setIsWarningModalVisible(false)}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)', // Nền mờ
            }}>
            <View
              style={{
                width: '80%', // Chiều rộng Modal
                backgroundColor: '#FFF',
                borderRadius: 16, // Bo góc mềm mại hơn
                padding: 25, // Padding rộng hơn
                alignItems: 'center',
                shadowColor: '#000', // Hiệu ứng đổ bóng
                shadowOffset: {width: 0, height: 4},
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5, // Đổ bóng trên Android
              }}>
              <TextComponent
                font={fontFamilies.medium}
                size={15} // Font lớn hơn
                text={`You are still too far from the destination!`}
                color={appColors.text}
                styles={{textAlign: 'center', marginBottom: 8}} // Căn giữa và thêm khoảng cách
              />
              <SpaceComponent height={15}></SpaceComponent>
              <TextComponent
                font={fontFamilies.bold} // Font đậm hơn để nhấn mạnh
                size={18} // Font lớn hơn để nổi bật
                text={`Remaining distance: ${distanceToDestination}`}
                color={appColors.red} // Màu đỏ để thu hút sự chú ý
                styles={{textAlign: 'center', marginBottom: 16}} // Căn giữa và thêm khoảng cách
              />
              <SpaceComponent height={20} />
              <ButtonComponent
                onPress={() => setIsWarningModalVisible(false)} // Đóng modal
                width={140} // Nút lớn hơn
                styles={{paddingVertical: 12, marginBottom: 0}} // Padding nút lớn hơn
                color={appColors.DarkSlateGrayBlue4}
                type="primary"
                textStyles={{flex: 0, fontSize: 16}} // Font chữ lớn hơn
                text="OK"
              />
            </View>
          </View>
        </Modal>
      </View>
      <View>
        {/* Modal xác nhận skip trip */}
        <Modal
          visible={isSkipTripModalVisible}
          transparent={true}
          animationType="fade"
          statusBarTranslucent={true}
          onRequestClose={() => setIsSkipTripModalVisible(false)}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}>
            <View
              style={{
                width: '80%',
                backgroundColor: '#FFF',
                borderRadius: 16,
                padding: 25,
                paddingBottom: 10,
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 4},
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5,
              }}>
              <TextComponent
                font={fontFamilies.bold}
                size={16}
                color={appColors.red}
                text="Warning!"
                styles={{marginBottom: 10}}
              />
              <TextComponent
                font={fontFamilies.medium}
                size={15}
                color={appColors.text}
                text="If you skip this trip, 30% of the trip fare will be deducted from your account. Are you sure you want to skip?"
                styles={{textAlign: 'center', marginBottom: 20}}
              />
              <RowComponent justify="space-around" styles={{width: '80%'}}>
                <ButtonComponent
                  onPress={() => setIsSkipTripModalVisible(false)}
                  width={100}
                  styles={{paddingVertical: 12}}
                  color={appColors.gray2}
                  textStyles={{color: appColors.text}}
                  type="primary"
                  text="Cancel"
                />
                <SpaceComponent width={20} />
                <ButtonComponent
                  onPress={() => {
                    setIsSkipTripModalVisible(false);
                    handleSkipTrip();
                  }}
                  styles={{paddingVertical: 12}}
                  width={100}
                  color={appColors.red}
                  type="primary"
                  text="OK"
                />
              </RowComponent>
            </View>
          </View>
        </Modal>
      </View>
      <View style={{flex: 1}}>
        {/* <RowComponent
          styles={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
          }}>
          <SectionComponent
            styles={[globalStyles.noSpaceCard, styles.buttonBack]}>
            <CardComponent
              onPress={() => {
                // onCloseMap();
                // clearData();
                navigation.goBack();
              }}
              styles={[
                globalStyles.noSpaceCard,
                globalStyles.shadow,
                {width: 40, height: 40, borderRadius: 100},
              ]}
              color={appColors.white}>
              <ArrowCircleLeft2 size="30" color={appColors.gray} />
            </CardComponent>
          </SectionComponent>
        </RowComponent> */}

        <View style={{flex: 1}}>
          <MapLibreGL.MapView
            styleURL={loadMap}
            style={{flex: 1}}
            compassEnabled={false}
            ref={mapRef}
            zoomEnabled={true}
            onPress={() => console.log('Map Pressed')}>
            <MapLibreGL.Camera
              ref={cameraRef}
              animationDuration={0}
              centerCoordinate={[105.772607, 20.980216]}
              zoomLevel={zoomLevel}
            />
            {/* <MapLibreGL.UserLocation /> */}
            {geoJSONData && (
              <MapLibreGL.ShapeSource id="routeSource" shape={geoJSONData}>
                <MapLibreGL.LineLayer
                  id="routeBorder"
                  style={{
                    lineColor: '#2F4F4F', // Màu viền (xám đậm hoặc đen)
                    lineWidth: 6, // Lớn hơn đường chính
                    lineOpacity: 0.8,
                    lineJoin: 'round',
                    lineCap: 'round',
                  }}
                />
                {/* Lớp đường chính - màu sáng hơn, mỏng hơn */}
                <MapLibreGL.LineLayer
                  id="routeLine"
                  style={{
                    lineColor: '#99FFFF', // Màu chính (xanh dương nhạt)
                    lineWidth: 3, // Nhỏ hơn lớp viền
                    lineOpacity: 0.9,
                    lineJoin: 'round',
                    lineCap: 'round',
                  }}
                />
              </MapLibreGL.ShapeSource>
            )}
            <MapLibreGL.Images
              images={{
                pickupIcon,
                destinationIcon,
                bikeIcon,
                carIcon,
                currentLocationFlag,
              }}
            />
            {geoJSONPoints && (
              <MapLibreGL.ShapeSource id="pointSource" shape={geoJSONPoints}>
                <MapLibreGL.SymbolLayer
                  id="pickupLayer"
                  minZoomLevel={0}
                  filter={['==', ['get', 'icon'], 'pickupIcon']} // Chỉ áp dụng cho pickup
                  style={{
                    iconImage: 'pickupIcon',
                    iconSize: 0.3,
                    iconOffset: [0, -55], // Đẩy lên trên cao hơn
                    // iconAnchor: 'bottom',
                    iconAllowOverlap: true,
                    textAllowOverlap: true,
                  }}
                />

                <MapLibreGL.SymbolLayer
                  id="destinationLayer"
                  minZoomLevel={0}
                  filter={['==', ['get', 'icon'], 'destinationIcon']} // Chỉ áp dụng cho destination
                  style={{
                    iconImage: 'destinationIcon',
                    iconSize: 0.48,
                    iconOffset: [0, -55], // Đẩy lên nhưng ít hơn pickup
                    // iconAnchor: 'bottom',
                    iconAllowOverlap: true,
                    textAllowOverlap: true,
                  }}
                />

                <MapLibreGL.SymbolLayer
                  id="currentLayer"
                  minZoomLevel={0}
                  filter={['==', ['get', 'icon'], 'currentLocationFlag']} // Chỉ áp dụng cho destination
                  style={{
                    iconImage: 'currentLocationFlag',
                    iconSize: 0.45,
                    iconOffset: [22, -45], // Đẩy lên nhưng ít hơn pickup
                    // iconAnchor: 'bottom',
                    iconAllowOverlap: true,
                    textAllowOverlap: true,
                  }}
                />
              </MapLibreGL.ShapeSource>
            )}
            {geoJSONCurrentPoints && (
              <MapLibreGL.ShapeSource
                id="pointSourceCurrent"
                shape={geoJSONCurrentPoints}>
                <MapLibreGL.SymbolLayer
                  id="currentPoint"
                  minZoomLevel={0}
                  filter={['==', ['get', 'icon'], 'bikeIcon']} // Chỉ áp dụng cho pickup
                  style={{
                    iconImage: 'bikeIcon',
                    iconSize: 0.2,
                    iconOffset: [0, -55], // Đẩy lên trên cao hơn
                    // iconAnchor: 'bottom',
                    iconAllowOverlap: true,
                    textAllowOverlap: true,
                    // iconRotate: ['get', 'rotation'],
                  }}
                />
              </MapLibreGL.ShapeSource>
            )}
          </MapLibreGL.MapView>
        </View>

        <BottomSheetModalProvider>
          <BottomSheet
            enableDynamicSizing={false}
            ref={bottomSheetRef}
            snapPoints={['18%', '28%']} // SnapPoints tối thiểu 30%
            // enablePanDownToClose={false} // Ngăn người dùng vuốt xuống để đóng
            style={{flex: 1}}>
            <BottomSheetView
              style={{
                height: '100%',
                // backgroundColor: 'coral',
              }}>
              <SectionComponent>
                <SpaceComponent height={5} />
                <TextComponent
                  font={fontFamilies.medium}
                  size={12}
                  color={appColors.text2}
                  text="You are moving to the pick up point"
                />

                {/* Hiển thị quãng đường và thời gian */}
                <SpaceComponent height={3} />
                <TextComponent
                  font={fontFamilies.semiBold}
                  size={14}
                  text={`Remaining distance: ${distanceToDestination}`}
                  color={appColors.text}
                />

                <SpaceComponent height={20} />
                <View
                  style={{
                    height: 3,
                    width: '100%',
                    backgroundColor: appColors.BlueDarkTurquoise,
                    borderRadius: 100,
                  }}
                />
                <SpaceComponent height={9} />
              </SectionComponent>
              <View
                style={{
                  height: 7,
                  width: '100%',
                  backgroundColor: appColors.WhiteSmoke,
                  borderRadius: 100,
                }}></View>
              <SpaceComponent height={9}></SpaceComponent>
              <SectionComponent
                styles={{
                  borderBottomWidth: 0.5,
                  borderBottomColor: appColors.gray2,
                }}>
                <RowComponent justify="space-between">
                  <RowComponent justify="flex-start" styles={{width: '60%'}}>
                    <Location size="16" color="#FF8A65" variant="Bold" />
                    <SpaceComponent width={20}></SpaceComponent>
                    <View>
                      <SpaceComponent height={10}></SpaceComponent>
                      {/* Hiển thị điểm đón hoặc điểm đến dựa trên trạng thái */}
                      <TextComponent
                        numOfLine={1}
                        font={fontFamilies.medium}
                        text={
                          !statusArrived
                            ? pickupAddress.main_name_place // Điểm đón
                            : destinationAddress.main_name_place // Điểm đến
                        }></TextComponent>
                      <SpaceComponent height={4}></SpaceComponent>
                      <TextComponent
                        size={11}
                        numOfLine={1}
                        font={fontFamilies.regular}
                        text={
                          !statusArrived
                            ? pickupAddress.description ||
                              'No description available' // Mô tả điểm đón
                            : destinationAddress.description ||
                              'No description available' // Mô tả điểm đến
                        }></TextComponent>
                    </View>
                  </RowComponent>
                  <RowComponent>
                    <RowComponent>
                      <CardComponent
                        onPress={() =>
                          navigation.navigate('RoomMessageScreen', {
                            roomId: data.roomChatId,
                          })
                        }
                        styles={[
                          globalStyles.noSpaceCard,
                          // globalStyles.shadow,
                          {width: 38, height: 38, borderRadius: 12},
                        ]}
                        color={appColors.gray6}>
                        <MessageText1
                          size="23"
                          variant="Bold"
                          color={appColors.gray}
                        />
                      </CardComponent>
                      <SpaceComponent width={10}></SpaceComponent>

                      <CardComponent
                        onPress={() => {
                          let phoneNumber = '123';
                          if (
                            data?.userId &&
                            typeof data.userId === 'object' &&
                            'mobile' in data.userId
                          ) {
                            phoneNumber =
                              (data.userId as {mobile?: string}).mobile ||
                              '123';
                          }
                          if (typeof data?.userId === 'string') {
                            phoneNumber = data.userId;
                          }
                          if (phoneNumber) {
                            Linking.openURL(`tel:${phoneNumber}`); // Mở ứng dụng gọi điện với số điện thoại
                          } else {
                            console.error('Phone number is not available');
                          }
                        }}
                        styles={[
                          globalStyles.noSpaceCard,
                          // globalStyles.shadow,
                          {width: 38, height: 38, borderRadius: 12},
                        ]}
                        color={appColors.gray6}>
                        <Call size="23" variant="Bold" color={appColors.gray} />
                      </CardComponent>
                    </RowComponent>
                  </RowComponent>
                </RowComponent>
              </SectionComponent>
              <SectionComponent>
                {!statusArrived ? (
                  <RowComponent
                    justify="space-around"
                    styles={{
                      width: '100%',
                      height: 80,
                    }}>
                    <ButtonComponent
                      onPress={() => setIsSkipTripModalVisible(true)}
                      width={118}
                      styles={{paddingVertical: 10}}
                      color={appColors.red}
                      type="primary"
                      textStyles={{flex: 0}}
                      text="Skip Trip"
                    />
                    {/* <ButtonComponent
                      onPress={() => {
                        socket.emit(
                          'notice-cancle-order-from-driver',
                          orderPending._id,
                        );
                        dispatch(setOrderPending({}));
                        navigation.goBack();
                      }}
                      width={118}
                      styles={{paddingVertical: 10}}
                      color={appColors.red}
                      type="primary"
                      textStyles={{flex: 0}}
                      text="Skip Trip"></ButtonComponent> */}
                    <ButtonComponent
                      width={180}
                      onPress={async () => {
                        // Kiểm tra khoảng cách trước khi xác nhận
                        let distanceInMeters = 0;
                        if (distanceToDestination.includes('km')) {
                          distanceInMeters =
                            parseFloat(
                              distanceToDestination.replace(' km', ''),
                            ) * 1000;
                        } else if (distanceToDestination.includes('m')) {
                          distanceInMeters = parseFloat(
                            distanceToDestination.replace(' m', ''),
                          );
                        }

                        console.log(distanceInMeters);

                        if (Number(distanceInMeters) > 200) {
                          setIsWarningModalVisible(true); // Hiển thị modal cảnh báo
                          return;
                        }
                        setStatusOrder(3);
                        setGeoJSONData(geoJSONDataCustomer);

                        // Nếu thỏa mãn điều kiện, thực hiện logic xác nhận

                        setStatusArrived(true);
                        setTimeout(async () => {
                          await cameraRef.current?.fitBounds(
                            [
                              pickupAddress.longitude ?? 0,
                              pickupAddress.latitude ?? 0,
                            ],
                            [
                              destinationAddress.longitude ?? 0,
                              destinationAddress.latitude ?? 0,
                            ],
                            [170, 50, 380, 50],
                            0,
                          );
                          await cameraRef.current?.setCamera({
                            animationDuration: 0, // Không animation để tránh dịch chuyển
                          });
                        }, 500);
                        await apiUpdateStatusBill({
                          billId: orderPending._id,
                          status: 'PENDING',
                        });
                        socket.emit('notice-arrival-at-pick-up-point', {
                          idOrder: orderPending._id,
                        });
                      }}
                      styles={{paddingVertical: 10}}
                      color={appColors.DarkSlateGrayBlue4}
                      type="primary"
                      textStyles={{flex: 0}}
                      text="Arrived at pickup"></ButtonComponent>
                  </RowComponent>
                ) : (
                  <RowComponent
                    justify="space-around"
                    styles={{
                      width: '100%',
                      height: 80,
                    }}>
                    <ButtonComponent
                      width={220}
                      onPress={async () => {
                        // Kiểm tra khoảng cách trước khi xác nhận
                        let distanceInMeters = 0;
                        if (distanceToDestination.includes('km')) {
                          distanceInMeters =
                            parseFloat(
                              distanceToDestination.replace(' km', ''),
                            ) * 1000;
                        } else if (distanceToDestination.includes('m')) {
                          distanceInMeters = parseFloat(
                            distanceToDestination.replace(' m', ''),
                          );
                        }

                        console.log(distanceInMeters);

                        // console.log(distanceToDestination);

                        if (Number(distanceInMeters) > 200) {
                          setIsWarningModalVisible(true); // Hiển thị modal cảnh báo
                          return;
                        }
                        // Nếu thỏa mãn điều kiện, thực hiện logic xác nhận
                        await apiUpdateStatusBill({
                          billId: orderPending._id,
                          status: 'COMPLETED',
                        });
                        socket.emit('notification-arrival-destination', {
                          idOrder: orderPending._id,
                        });
                        navigation.replace('ConfirmInfBill', {data});
                      }}
                      styles={{paddingVertical: 10}}
                      color={appColors.DarkSlateGrayBlue4}
                      type="primary"
                      textStyles={{flex: 0}}
                      text="Arrived at destination"></ButtonComponent>
                  </RowComponent>
                )}
              </SectionComponent>
            </BottomSheetView>
          </BottomSheet>
        </BottomSheetModalProvider>
      </View>
    </View>
  );
};

export default DirectionsMapScreen;
