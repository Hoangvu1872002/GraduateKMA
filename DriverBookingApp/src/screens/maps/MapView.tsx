import {View, Text, StatusBar, Platform, TouchableOpacity} from 'react-native';
import React, {useRef, useState, useEffect} from 'react';
import {globalStyles} from '../../styles/globalStyles';
import {appColors} from '../../constants/appColors';
import {RowComponent, TextComponent} from '../../components';
import {ArrowLeft} from 'iconsax-react-native';
import {fontFamilies} from '../../constants/fontFamilies';
import MapLibreGL from '@maplibre/maplibre-react-native';
import Geolocation from '@react-native-community/geolocation';

const loadMap =
  'https://tiles.goong.io/assets/goong_map_web.json?api_key=WKhuQZ3GCrTsAv9fvPSn0BHu0kc0NfgD1UAwZrcQ';

MapLibreGL.setAccessToken(null); // Goong sử dụng API Key riêng
MapLibreGL.setConnected(true);

const MapView = ({navigation}: any) => {
  const cameraRef = useRef<MapLibreGL.CameraRef>(null);
  const mapRef = useRef<MapLibreGL.MapViewRef>(null);

  const [centerCoords, setCenterCoords] = useState<{
    latitude: number;
    longitude: number;
  }>({
    latitude: 20.980216,
    longitude: 105.772607,
  });
  const [zoomLevel, setZoomLevel] = useState<number>(12);

  // Lấy vị trí hiện tại khi mở map
  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        setCenterCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      error => {
        console.log('Lỗi lấy vị trí:', error);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  }, []);

  return (
    <View
      style={[
        globalStyles.container,
        {flex: 1, backgroundColor: appColors.gray6},
      ]}>
      <StatusBar barStyle={'light-content'} />
      <View style={[globalStyles.shadow, {height: 95, borderRadius: 20}]}>
        <View
          style={[
            globalStyles.shadow,
            {
              backgroundColor: appColors.primary,

              height: 85,
              width: '100%',
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
              justifyContent: 'center',

              alignItems: 'center',
              paddingTop:
                Platform.OS === 'android' ? StatusBar.currentHeight : 52,
            },
          ]}>
          <RowComponent justify="flex-start" styles={{flex: 1, marginLeft: 20}}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                width: 48,
                height: 48,
                justifyContent: 'center',
              }}>
              <ArrowLeft size={28} color={appColors.white} />
            </TouchableOpacity>
            <TextComponent
              flex={1}
              font={fontFamilies.semiBold}
              text={`Map View`}
              title
              color={appColors.white}
            />
          </RowComponent>
        </View>
      </View>
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
            animationDuration={100}
            centerCoordinate={[centerCoords.longitude, centerCoords.latitude]}
            zoomLevel={zoomLevel}
          />
          <MapLibreGL.UserLocation />
        </MapLibreGL.MapView>
      </View>
    </View>
  );
};

export default MapView;
