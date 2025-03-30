import {View, Text, StatusBar, Image} from 'react-native';
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
import {styles} from './ModalMapLocation.styles';
import {appColors} from '../../constants/appColors';
import {ArrowCircleLeft2, Location, Moneys} from 'iconsax-react-native';
import {fontFamilies} from '../../constants/fontFamilies';
import {BottomSheetModalProvider, BottomSheetView} from '@gorhom/bottom-sheet';
import BottomSheet from '@gorhom/bottom-sheet';
import Geolocation from '@react-native-community/geolocation';

import {RootState} from '../../stores/redux';
import {useSelector} from 'react-redux';
import socket from '../../apis/socket';

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
const currentLocationFlag = require('../../assets/images/flag_current.png');

const loadMap =
  'https://tiles.goong.io/assets/goong_map_web.json?api_key=K4Wf0bYa0I5v8wxWCjRmeohWKjmHaHr9j2jwfImc';

const DetailOrderScreen = ({navigation, route}: any) => {
  const {data}: {data: IBillTemporary} = route?.params || {};
  const {pickupAddress, destinationAddress, _id} = data;

  const {currentLocation, current} = useSelector(
    (state: RootState) => state.user,
  );

  const cameraRef = useRef<MapLibreGL.CameraRef | null>(null);
  const mapRef = useRef<MapLibreGL.MapViewRef>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [geoJSONDataCustomer, setGeoJSONDataCustomer] =
    useState<FeatureCollection<LineString> | null>(null);
  const [geoJSONDataDriver, setGeoJSONDataDriver] =
    useState<FeatureCollection<LineString> | null>(null);
  const [geoJSONPoints, setGeoJSONPoints] = useState<PointFeature | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(16);

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

  const fetchRouteCustomer = async () => {
    try {
      const responseCustomer = await axios.get(
        'https://rsapi.goong.io/Direction',
        {
          params: {
            origin: `${pickupAddress.latitude},${pickupAddress.longitude}`,
            destination: `${destinationAddress.latitude},${destinationAddress.longitude}`,
            vehicle: 'bike',
            api_key: 'sJrvIqiCKE2h7akqUhzs1gyVqt5PiCURtoVihCjg',
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

      setTimeout(async () => {
        await cameraRef.current?.fitBounds(
          [currentLocation.longitude ?? 0, currentLocation.latitude ?? 0],
          [destinationAddress.longitude ?? 0, destinationAddress.latitude ?? 0],
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

  const fetchRouteDriver = async () => {
    const responseDriver = await axios.get('https://rsapi.goong.io/Direction', {
      params: {
        origin: `${currentLocation.latitude},${currentLocation.longitude}`,
        destination: `${pickupAddress.latitude},${pickupAddress.longitude}`,
        vehicle: 'bike',
        api_key: 'sJrvIqiCKE2h7akqUhzs1gyVqt5PiCURtoVihCjg',
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

  useEffect(() => {
    fetchRouteDriver();
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
    socket.on('notice-remove-order-from-user', data => {
      if (data === _id) {
        navigation.goBack();
      }
    });
  }, []);

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
          {geoJSONDataDriver && (
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
            images={{pickupIcon, destinationIcon, currentLocationFlag}}
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
        </MapLibreGL.MapView>
      </View>
      <BottomSheetModalProvider>
        <BottomSheet
          enableDynamicSizing={false}
          ref={bottomSheetRef}
          snapPoints={[
            // '20%',
            '23%',
            '30%',
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
                text="Order details information"></TextComponent>
              <SpaceComponent height={5}></SpaceComponent>

              <SpaceComponent height={9}></SpaceComponent>
              <View
                style={{
                  height: 3,
                  width: '100%',
                  backgroundColor: appColors.BlueDarkTurquoise,
                  borderRadius: 100,
                }}></View>
              <SpaceComponent height={9}></SpaceComponent>
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
              <RowComponent justify="flex-start">
                <Image
                  source={require('../../assets/images/icons_ico_map_pin.png')}
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
                // styles={{
                //   width: '40%',
                //   // borderRightWidth: 0.8,
                //   // borderRightColor: appColors.gray2,
                // }}
                justify="flex-end">
                <Moneys size="20" variant="Bulk" color="green" />
                <SpaceComponent width={10}></SpaceComponent>
                <TextComponent
                  text="Pay in cash"
                  // color={appColors.text2}
                  font={fontFamilies.medium}
                  size={13}></TextComponent>
              </RowComponent>
              <RowComponent
                styles={{
                  width: '100%',
                  height: 100,
                }}>
                <ButtonComponent
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
                  text="Receive Trip"></ButtonComponent>
              </RowComponent>
            </SectionComponent>
          </BottomSheetView>
        </BottomSheet>
      </BottomSheetModalProvider>
    </View>
  );
};

export default DetailOrderScreen;
