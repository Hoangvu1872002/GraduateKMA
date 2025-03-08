import {View, Text, StatusBar, Image} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {IBillTemporary} from '../../../models/SelectModel';
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
import {ArrowCircleLeft2, Location, Moneys} from 'iconsax-react-native';
import {fontFamilies} from '../../constants/fontFamilies';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import BottomSheet from '@gorhom/bottom-sheet';
import {styles} from './ModalMapLocation.styles';
import Geolocation from '@react-native-community/geolocation';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from '../../stores/redux';

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
const bikeIcon = require('../../assets/images/bike.png');
const carIcon = require('../../assets/images/car.png');

const loadMap =
  'https://tiles.goong.io/assets/goong_map_web.json?api_key=V0HS8KfYmnE7ZT2vA1ONH00H7NqKOTm7vu46U4cq';

const DirectionsMapScreen = ({navigation, route}: any) => {
  const {data}: {data: IBillTemporary} = route?.params || {};
  const {pickupAddress, destinationAddress} = data;
  const {currentLocation} = useSelector((state: RootState) => state.user);

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

  const fetchRouteDriver = async () => {
    const responseDriver = await axios.get('https://rsapi.goong.io/Direction', {
      params: {
        origin: `${currentLocation.latitude},${currentLocation.longitude}`,
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

    setGeoJSONData(dataDriver);
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
          <MapLibreGL.UserLocation />
          {geoJSONData && (
            <MapLibreGL.ShapeSource id="routeSource" shape={geoJSONData}>
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
                  lineColor: '#99FFFF', // Màu chính (xanh dương nhạt)
                  lineWidth: 6, // Nhỏ hơn lớp viền
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
                  iconSize: 0.1,
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
      {/* <BottomSheetModalProvider>
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={['18%', '24%']} // SnapPoints tối thiểu 30%
          // enablePanDownToClose={false} // Ngăn người dùng vuốt xuống để đóng
          style={{flex: 1}}>
          <View
            style={{
              height: '100%',
              // backgroundColor: 'coral',
            }}>
            <SectionComponent>
              <TextComponent
                font={fontFamilies.medium}
                text="You are moving to the pick up point"></TextComponent>
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
                <Location size="16" color="#FF8A65" variant="Bold" />
                <SpaceComponent width={20}></SpaceComponent>
                <View>
                  <SpaceComponent height={10}></SpaceComponent>
                  <TextComponent
                    numOfLine={1}
                    font={fontFamilies.medium}
                    text={
                      destinationAddress.main_name_place
                    }></TextComponent>
                  <SpaceComponent height={4}></SpaceComponent>
                  <TextComponent
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
              <RowComponent
                justify="space-around"
                styles={{
                  width: '100%',
                  height: 80,
                }}>
                <ButtonComponent
                  width={118}
                  styles={{paddingVertical: 10}}
                  color={appColors.red}
                  type="primary"
                  textStyles={{flex: 0}}
                  text="Skip Trip"></ButtonComponent>
                <ButtonComponent
                  width={180}
                  onPress={() => {
                    setGeoJSONData(geoJSONDataCustomer);
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
                    }, 500);
                  }}
                  styles={{paddingVertical: 10}}
                  color={appColors.DarkSlateGrayBlue4}
                  type="primary"
                  textStyles={{flex: 0}}
                  text="Arrived at pickup"></ButtonComponent>
              </RowComponent>
            </SectionComponent>
          </View>
        </BottomSheet>
      </BottomSheetModalProvider> */}
    </View>
  );
};

export default DirectionsMapScreen;
