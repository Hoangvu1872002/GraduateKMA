import {View, Text, StatusBar, Image, Linking} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {FeatureCollection, Feature, LineString, Point} from 'geojson';
import MapLibreGL from '@maplibre/maplibre-react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../../../stores/redux';
import axios from 'axios';
import {
  ButtonComponent,
  CardComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '../../../components';
import {globalStyles} from '../../../styles/globalStyles';
import {styles} from './ModalMapLocation.styles';
import {appColors} from '../../../constants/appColors';
import {
  ArrowCircleLeft2,
  ArrowDown2,
  ArrowRight2,
  Call,
  Location,
  MessageText1,
  Moneys,
  Star1,
} from 'iconsax-react-native';
import socket from '../../../apis/socket';
import BottomSheet, {
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {fontFamilies} from '../../../constants/fontFamilies';
import {useFocusEffect} from '@react-navigation/native';

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

const pickupIcon = require('../../../assets/images/ic_map_ic_pick.png');
const destinationIcon = require('../../../assets/images/icons_pickupmarker.png');
const bikeIcon = require('../../../assets/images/img_vespa_top.png');
const carIcon = require('../../../assets/images/car.png');

const loadMap =
  'https://tiles.goong.io/assets/goong_map_web.json?api_key=V0HS8KfYmnE7ZT2vA1ONH00H7NqKOTm7vu46U4cq';

const ScreenMapFollowDriver = ({navigation, route}: any) => {
  const {data}: {data: any} = route?.params || {};

  const {pickupAddress, destinationAddress, driverId, _id} = data;

  const {current} = useSelector((state: RootState) => state.user);

  const cameraRef = useRef<MapLibreGL.CameraRef | null>(null);
  const mapRef = useRef<MapLibreGL.MapViewRef>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [geoJSONDataCustomer, setGeoJSONDataCustomer] =
    useState<FeatureCollection<LineString> | null>(null);
  const [geoJSONDataDriver, setGeoJSONDataDriver] =
    useState<FeatureCollection<LineString> | null>(null);
  const [geoJSONPoints, setGeoJSONPoints] = useState<PointFeature | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(16);
  const [currentDriverLocation, setCurrentDriverLocation] =
    useState<Coordinates>({
      latitude: driverId.location.coordinates[1],
      longitude: driverId.location.coordinates[0],
    });
  const [geoJSONCurrentDriverPoints, setGeoJSONCurrentDriverPoints] =
    useState<PointFeature | null>(null);

  const [statusBill, setStatusBill] = useState(data.status);

  // console.log(driverId);

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
    ],
  });

  const getCurrentDriverPointData = ({
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
            origin:
              statusBill === 'RECEIVED'
                ? `${pickupAddress.latitude},${pickupAddress.longitude}`
                : `${currentDriverLocation.latitude},${currentDriverLocation.longitude}`,
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
    } catch (error) {
      console.error('Error fetching route:', error);
    }
  };

  const fetchRouteDriver = async () => {
    const responseDriver = await axios.get('https://rsapi.goong.io/Direction', {
      params: {
        origin: `${currentDriverLocation.latitude},${currentDriverLocation.longitude}`,
        destination: `${pickupAddress.latitude},${pickupAddress.longitude}`,
        vehicle: 'bike',
        api_key: 'crMmofRW2lgZNiDMZtCUdYqHZfGZv1cVZ864e0CR',
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

    setGeoJSONDataDriver(dataDriver);
  };

  const handleRegionChange = (e: any) => {
    const {geometry, properties} = e;
  };

  useEffect(() => {
    if (statusBill === 'RECEIVED') {
      fetchRouteDriver();
    } else if (statusBill === 'PENDING') {
      fetchRouteCustomer();
    }
    // fetchRouteCustomer();
    setTimeout(() => {
      const pointData = getCurrentDriverPointData({
        latitude: currentDriverLocation.latitude,
        longitude: currentDriverLocation.longitude,
      });
      setGeoJSONCurrentDriverPoints(pointData);
      // cameraRef.current?.setCamera({
      //   centerCoordinate: [currentDriverLocation.longitude, currentDriverLocation.latitude],
      //   animationDuration: 1000, // Di chuyển mượt
      // });
    }, 70);
  }, [currentDriverLocation]);

  useEffect(() => {
    // fetchRouteDriver();
    fetchRouteCustomer();
    setTimeout(async () => {
      currentDriverLocation &&
        (await cameraRef.current?.fitBounds(
          [
            currentDriverLocation.longitude ?? 0,
            currentDriverLocation.latitude ?? 0,
          ],
          [pickupAddress.longitude ?? 0, pickupAddress.latitude ?? 0],
          [170, 50, 380, 50],
          0,
        ));

      await cameraRef.current?.setCamera({
        animationDuration: 0, // Không animation để tránh dịch chuyển
      });
    }, 500);
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
        );

        setGeoJSONPoints(pointData);
      }
    }, 500);
  }, [pickupAddress, destinationAddress]);

  useFocusEffect(
    useCallback(() => {
      const handleLocationUpdate = (data: {
        locationDriver: {latitude: number; longitude: number};
        // statusBill: string;
      }) => {
        setCurrentDriverLocation(data.locationDriver);
        // setStatusBill(data.statusBill);
      };

      const handleCancelOrder = (data: string) => {
        if (data === _id) {
          navigation.goBack();
        }
      };

      const handleUpdateStatusBill = (data: string) => {
        if (data === _id) {
          setStatusBill('PENDING');
        }
      };

      const handleCompleteBill = (datask: string) => {
        if (datask === _id) {
          navigation.replace('ConfirmInfBill', {data: data});
        }
      };

      socket.on(`location-driver-shipping-${_id}`, handleLocationUpdate);
      socket.on('notice-cancle-order-from-driver', handleCancelOrder);
      socket.on('notice-arrival-at-pick-up-point', handleUpdateStatusBill);
      // socket.on('notification-arrival-destination', handleCompleteBill);

      return () => {
        socket.off(`location-driver-shipping-${_id}`, handleLocationUpdate);
        socket.off('notice-cancle-order-from-driver', handleCancelOrder);
        socket.off('notice-arrival-at-pick-up-point', handleUpdateStatusBill);
        // socket.off('notification-arrival-destination', handleCompleteBill);
      };
    }, [_id]),
  );

  return (
    <View style={{flex: 1, position: 'relative'}}>
      <StatusBar
        barStyle="dark-content"
        translucent={true}
        backgroundColor="transparent"
      />
      <RowComponent
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
      </RowComponent>

      <View style={{flex: 1}}>
        <MapLibreGL.MapView
          styleURL={loadMap}
          style={{flex: 1}}
          compassEnabled={false}
          onRegionDidChange={async e => {
            await handleRegionChange(e);
          }}
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

          {geoJSONDataCustomer && (
            <MapLibreGL.ShapeSource
              id="routeSource"
              shape={geoJSONDataCustomer}>
              <MapLibreGL.LineLayer
                id="routeBorder"
                // layerIndex={1}
                style={{
                  lineColor: '#2F4F4F', // Màu viền (xám đậm hoặc đen)
                  lineWidth: 10, // Lớn hơn đường chính
                  lineOpacity: 0.8,
                  lineJoin: 'round',
                  lineCap: 'round',
                }}
              />

              {/* Lớp đường chính - màu sáng hơn, mỏng hơn */}
              <MapLibreGL.LineLayer
                id="routeLine"
                // layerIndex={10}
                style={{
                  lineColor: '#EEE685', // Màu chính (xanh dương nhạt)
                  lineWidth: 6, // Nhỏ hơn lớp viền
                  lineOpacity: 0.9,
                  lineJoin: 'round',
                  lineCap: 'round',
                }}
              />
            </MapLibreGL.ShapeSource>
          )}
          {geoJSONDataDriver && statusBill === 'RECEIVED' && (
            <MapLibreGL.ShapeSource
              id="routeSourceDr"
              shape={geoJSONDataDriver}>
              <MapLibreGL.LineLayer
                id="routeBorderDr"
                // layerIndex={1}
                style={{
                  lineColor: '#2F4F4F', // Màu viền (xám đậm hoặc đen)
                  lineWidth: 9, // Lớn hơn đường chính
                  lineOpacity: 0.8,
                  lineJoin: 'round',
                  lineCap: 'round',
                }}
              />

              {/* Lớp đường chính - màu sáng hơn, mỏng hơn */}
              <MapLibreGL.LineLayer
                id="routeLineDr"
                // layerIndex={10}
                style={{
                  lineColor: '#99FFFF', // Màu chính (xanh dương nhạt)
                  lineWidth: 5, // Nhỏ hơn lớp viền
                  lineOpacity: 0.9,
                  lineJoin: 'round',
                  lineCap: 'round',
                }}
              />
            </MapLibreGL.ShapeSource>
          )}
          <MapLibreGL.Images
            images={{pickupIcon, destinationIcon, bikeIcon, carIcon}}
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
            </MapLibreGL.ShapeSource>
          )}
          {geoJSONCurrentDriverPoints && (
            <MapLibreGL.ShapeSource
              id="pointSourceCurrent"
              shape={geoJSONCurrentDriverPoints}>
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
          snapPoints={[
            // '20%',
            // '23%',
            '28%',
            '35%',
            '40%',
            '45%',
            '50%',
            '55%',
            '60%',
            '65%',
            '70%',
            '75%',
            '80%',
            '90%',
          ]} // SnapPoints tối thiểu 30%
          enablePanDownToClose={false} // Ngăn người dùng vuốt xuống để đóng
          style={{flex: 1}}>
          <BottomSheetView
            style={{
              height: '100%',
              // backgroundColor: 'coral',
            }}>
            <SectionComponent>
              <TextComponent
                font={fontFamilies.medium}
                text="The driver expected to earn in 3 minutes"></TextComponent>
              <SpaceComponent height={3}></SpaceComponent>
              <TextComponent
                font={fontFamilies.medium}
                size={11}
                color={appColors.gray}
                text={`Moving to "${pickupAddress.main_name_place}"`}></TextComponent>
              {/* <SpaceComponent height={5}></SpaceComponent> */}

              <SpaceComponent height={9}></SpaceComponent>
              <View
                style={{
                  height: 3,
                  width: '100%',
                  backgroundColor: appColors.BlueDarkTurquoise,
                  borderRadius: 100,
                }}></View>
              <SpaceComponent height={5}></SpaceComponent>
            </SectionComponent>
            <View
              style={{
                height: 7,
                width: '100%',
                backgroundColor: appColors.WhiteSmoke,
                borderRadius: 100,
              }}></View>
            <SpaceComponent height={9}></SpaceComponent>

            <SectionComponent>
              <RowComponent justify="space-between">
                <View style={{width: 150}}>
                  <TextComponent
                    text={driverId.licensePlate}
                    font={fontFamilies.semiBold}
                    size={16}></TextComponent>
                  <TextComponent
                    text={driverId.vehicleBrand.toUpperCase()}
                    font={fontFamilies.medium}
                    color={appColors.gray}
                    size={14}></TextComponent>
                </View>
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
                      const phoneNumber = driverId.mobile; // Thay thế bằng số điện thoại của tài xế
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
              <SpaceComponent height={15}></SpaceComponent>
              <SectionComponent
                styles={{
                  borderWidth: 0.5,
                  borderColor: appColors.gray,
                  justifyContent: 'center',

                  paddingBottom: 5,
                  paddingTop: 5,
                  paddingHorizontal: 5,
                  borderRadius: 12,
                }}>
                <RowComponent justify="space-between">
                  <RowComponent styles={{width: 200}} justify="flex-start">
                    <Image
                      source={{
                        uri: 'https://static.vecteezy.com/system/resources/previews/024/183/502/original/male-avatar-portrait-of-a-young-man-with-a-beard-illustration-of-male-character-in-modern-color-style-vector.jpg',
                      }}
                      style={{
                        width: 60,
                        height: 60,
                        resizeMode: 'cover',
                      }}
                    />
                    <SpaceComponent width={15}></SpaceComponent>
                    <View>
                      <TextComponent
                        font={fontFamilies.medium}
                        text={`${driverId.firstname} ${driverId.lastname}`}></TextComponent>
                      <SpaceComponent height={7}></SpaceComponent>
                      <RowComponent justify="flex-start">
                        <Star1 size="18" color="#FF8A65" variant="Bold" />
                        <SpaceComponent width={5}></SpaceComponent>
                        <TextComponent
                          font={fontFamilies.medium}
                          text={driverId.totalRating.toFixed(
                            0,
                          )}></TextComponent>
                      </RowComponent>
                    </View>
                  </RowComponent>
                  <ArrowRight2 size="20" color={appColors.gray} />
                </RowComponent>
              </SectionComponent>
            </SectionComponent>
            <SpaceComponent height={5}></SpaceComponent>
            <View
              style={{
                height: 7,
                width: '100%',
                backgroundColor: appColors.WhiteSmoke,
                borderRadius: 100,
              }}></View>

            <SectionComponent styles={{paddingTop: 10}}>
              <RowComponent justify="space-between">
                <TextComponent
                  text="Pay money"
                  font={fontFamilies.medium}></TextComponent>
                <ArrowDown2 size="18" color={appColors.text} />
              </RowComponent>
              <SpaceComponent height={8}></SpaceComponent>
              <RowComponent justify="space-between">
                <TextComponent text="Cash payment"></TextComponent>
                <TextComponent
                  font={fontFamilies.medium}
                  size={13}
                  text={`${data.cost.toFixed(2)} $`}></TextComponent>
              </RowComponent>
            </SectionComponent>
            <View
              style={{
                height: 7,
                width: '100%',
                backgroundColor: appColors.WhiteSmoke,
                borderRadius: 100,
              }}></View>

            <SectionComponent
              styles={{
                borderBottomWidth: 0.5,
                borderBottomColor: appColors.gray2,
              }}>
              <SpaceComponent height={15}></SpaceComponent>
              <RowComponent justify="space-between">
                <TextComponent
                  font={fontFamilies.medium}
                  text={`Trip Code:  ${data._id}`}></TextComponent>
                <TextComponent
                  color={appColors.gray}
                  size={12}
                  text={`18/7/2002`}></TextComponent>
              </RowComponent>
              <SpaceComponent height={5}></SpaceComponent>
              <RowComponent justify="flex-start">
                <TextComponent
                  text={driverId.travelMode}
                  color={appColors.gray}
                  size={13}></TextComponent>
              </RowComponent>
              <SpaceComponent height={10}></SpaceComponent>
              <SectionComponent
                styles={{
                  paddingBottom: 15,
                  backgroundColor: appColors.gray6,
                  padding: 15,
                  borderRadius: 12,
                }}>
                <RowComponent>
                  <View
                    style={{
                      flex: 1,
                      // backgroundColor: 'coral',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRightWidth: 0.5,
                      borderRightColor: appColors.gray,
                    }}>
                    <TextComponent
                      flex={0}
                      font={fontFamilies.medium}
                      text={`${data.distanceInKilometers} km`}></TextComponent>
                    <TextComponent
                      flex={0}
                      size={12}
                      color={appColors.gray}
                      // font={fontFamilies.medium}
                      text="Distance"></TextComponent>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      // backgroundColor: 'green',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <TextComponent
                      flex={0}
                      font={fontFamilies.medium}
                      text={`${data.durationInMinutes} minute`}></TextComponent>
                    <TextComponent
                      flex={0}
                      size={12}
                      color={appColors.gray}
                      // font={fontFamilies.medium}
                      text="Estimated time"></TextComponent>
                  </View>
                </RowComponent>
              </SectionComponent>
              <SpaceComponent height={15}></SpaceComponent>
              <RowComponent justify="flex-start">
                <Image
                  source={require('../../../assets/images/icons_ico_map_pin.png')}
                  style={{
                    width: 15,
                    height: 15,
                    resizeMode: 'cover',
                  }}
                />
                <SpaceComponent width={20}></SpaceComponent>
                <View
                  style={{
                    borderBottomWidth: 0.5,
                    flex: 1,
                    borderBottomColor: appColors.gray2,
                  }}>
                  <TextComponent
                    numOfLine={1}
                    font={fontFamilies.medium}
                    text={pickupAddress.main_name_place}></TextComponent>
                  <SpaceComponent height={4}></SpaceComponent>
                  <TextComponent
                    size={11}
                    numOfLine={1}
                    font={fontFamilies.regular}
                    text={
                      pickupAddress.description || 'Not data for description'
                    }></TextComponent>
                  <SpaceComponent height={10}></SpaceComponent>
                </View>
              </RowComponent>
              <RowComponent justify="flex-start">
                <Location size="16" color="#FF8A65" variant="Bold" />
                <SpaceComponent width={20}></SpaceComponent>
                <View>
                  <SpaceComponent height={10}></SpaceComponent>
                  <TextComponent
                    // styles={{maxWidth: '90%'}}
                    // size={13}
                    numOfLine={1}
                    font={fontFamilies.medium}
                    text={destinationAddress.main_name_place}></TextComponent>
                  <SpaceComponent height={4}></SpaceComponent>
                  <TextComponent
                    // styles={{maxWidth: '90%'}}
                    size={11}
                    numOfLine={1}
                    font={fontFamilies.regular}
                    text={
                      destinationAddress.description ||
                      'Not data for description'
                    }></TextComponent>
                </View>
              </RowComponent>
            </SectionComponent>

            <SectionComponent>
              <SpaceComponent height={8}></SpaceComponent>

              <RowComponent
                // justify="space-around"
                styles={{
                  width: '100%',
                  height: 100,
                }}>
                <ButtonComponent
                  width={118}
                  styles={{paddingVertical: 10}}
                  color={appColors.red}
                  type="primary"
                  textStyles={{flex: 0}}
                  text="Skip Trip"></ButtonComponent>
                {/* <ButtonComponent
                  width={130}
                  onPress={() => {
                    navigation.replace('DirectionsMapScreen', {data: data});
                    socket.emit('notice-receipt-order', {
                      infDriver: current,
                      idBillTemporary: data._id,
                      socketIdCustomer: data.infCustomer.socketId,
                    });
                  }}
                  styles={{paddingVertical: 10}}
                  color={appColors.DarkSlateGrayBlue4}
                  type="primary"
                  textStyles={{flex: 0}}
                  text="Receive Trip"></ButtonComponent> */}
              </RowComponent>
            </SectionComponent>
          </BottomSheetView>
        </BottomSheet>
      </BottomSheetModalProvider>
    </View>
  );
};

export default ScreenMapFollowDriver;
