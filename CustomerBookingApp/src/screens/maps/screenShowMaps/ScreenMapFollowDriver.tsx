import {View, Text, StatusBar} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {FeatureCollection, Feature, LineString, Point} from 'geojson';
import MapLibreGL from '@maplibre/maplibre-react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../../../stores/redux';
import axios from 'axios';
import {
  CardComponent,
  RowComponent,
  SectionComponent,
} from '../../../components';
import {globalStyles} from '../../../styles/globalStyles';
import {styles} from './ModalMapLocation.styles';
import {appColors} from '../../../constants/appColors';
import {ArrowCircleLeft2} from 'iconsax-react-native';
import socket from '../../../apis/socket';

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

const loadMap =
  'https://tiles.goong.io/assets/goong_map_web.json?api_key=V0HS8KfYmnE7ZT2vA1ONH00H7NqKOTm7vu46U4cq';

const ScreenMapFollowDriver = ({navigation, route}: any) => {
  const {data}: {data: any} = route?.params || {};
  // console.log(data);

  const {pickupAddress, destinationAddress, driverId, _id} = data;

  const {current} = useSelector((state: RootState) => state.user);

  const cameraRef = useRef<MapLibreGL.CameraRef | null>(null);
  const mapRef = useRef<MapLibreGL.MapViewRef>(null);
  // const bottomSheetRef = useRef<BottomSheet>(null)
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
    fetchRouteDriver();
    // fetchRouteCustomer();
  }, [currentDriverLocation]);

  useEffect(() => {
    // fetchRouteDriver();
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
    socket.on(`location-driver-shipping-${_id}`, data => {
      setCurrentDriverLocation(data);
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
          <MapLibreGL.Images images={{pickupIcon, destinationIcon}} />
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
        </MapLibreGL.MapView>
      </View>
    </View>
  );
};

export default ScreenMapFollowDriver;
