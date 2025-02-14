import {View, Modal, StatusBar, StyleSheet, Image, Button} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ButtonComponent,
  CardComponent,
  ContainerComponent,
  SectionComponent,
  TextComponent,
} from '../../components';
import {globalStyles} from '../../styles/globalStyles';
import {ArrowCircleLeft2, Location} from 'iconsax-react-native';
import {appColors} from '../../constants/appColors';
import MapLibreGL from '@maplibre/maplibre-react-native';
import Geolocation from '@react-native-community/geolocation';
import {useFocusEffect} from '@react-navigation/native';
import axios from 'axios';
import {fontFamilies} from '../../constants/fontFamilies';
import {LocationModelSuggest} from '../../models/LocationModel';
import FastImage from 'react-native-fast-image';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';

import {styles} from './ModalMapLocation.styles';
// import {Portal} from 'react-native-portalize';
import BottomSheet from '@gorhom/bottom-sheet';

interface Props {
  visible: boolean;
  dataLocationSelected: LocationModelSuggest;
  onCloseMap: () => void;
  onCloseAll?: () => void;
}

MapLibreGL.setAccessToken(null); // Goong sử dụng API Key riêng
MapLibreGL.setConnected(true);

const loadMap =
  'https://tiles.goong.io/assets/goong_map_web.json?api_key=V0HS8KfYmnE7ZT2vA1ONH00H7NqKOTm7vu46U4cq';

const ModalMapFindDriver = (props: Props) => {
  const {visible, onCloseAll, onCloseMap, dataLocationSelected} = props;

  const cameraRef = useRef<MapLibreGL.CameraRef>(null);
  const mapRef = useRef<MapLibreGL.MapViewRef>(null);

  // const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [centerCoords, setCenterCoords] = useState<{
    latitude: number;
    longitude: number;
  }>({
    latitude: 20.980216,
    longitude: 105.772607,
  });
  const [isVisibleModalize, setIsVisibleModalize] = useState(true);

  const [zoomLevel, setZoomLevel] = useState<number>(15);

  useEffect(() => {
    if (visible) {
      if (!dataLocationSelected) {
      } else if (
        dataLocationSelected &&
        dataLocationSelected.latitude &&
        dataLocationSelected.longitude
      ) {
        setCenterCoords({
          latitude: dataLocationSelected.latitude,
          longitude: dataLocationSelected.longitude,
        });
      } else {
        console.log('abc3');
      }
    }
  }, [visible]);
  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.expand;
    }
  }, [visible]);

  return (
    // <BottomSheetModalProvider>
    <>
      <Modal
        animationType="slide"
        visible={visible}
        transparent={true}
        statusBarTranslucent={true}
        style={{position: 'relative'}}>
        <StatusBar
          barStyle="dark-content"
          translucent={true}
          backgroundColor="#ffffff"
        />
        <SectionComponent
          styles={[globalStyles.noSpaceCard, styles.buttonBack]}>
          <CardComponent
            onPress={() => {
              onCloseMap();
              // clearData();
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
            {/* <MapLibreGL.MarkerView
            coordinate={[
              dataLocationSelected.longitude ?? centerCoords.longitude,
              dataLocationSelected?.latitude ?? centerCoords.latitude,
            ]}>
            <View style={styless.markerContainer}>
              <FastImage
                source={require('../../assets/gifs/animationRadar4.gif')} // Thay bằng link GIF radar của bạn
                style={styless.radarGif2}
                resizeMode={FastImage.resizeMode.contain}
              />
            </View>
          </MapLibreGL.MarkerView>
          <MapLibreGL.MarkerView
            coordinate={[
              dataLocationSelected.longitude ?? centerCoords.longitude,
              dataLocationSelected?.latitude ?? centerCoords.latitude,
            ]}>
            <View style={styless.markerContainer}>
              <FastImage
                source={require('../../assets/gifs/animationRadar3.gif')} // Thay bằng link GIF radar của bạn
                style={styless.radarGif}
                resizeMode={FastImage.resizeMode.contain}
              />
            </View>
          </MapLibreGL.MarkerView> */}

            <MapLibreGL.MarkerView
              coordinate={[
                dataLocationSelected.longitude ?? centerCoords.longitude,
                dataLocationSelected?.latitude ?? centerCoords.latitude,
              ]}>
              <View style={styless.markerContainer}>
                <FastImage
                  source={require('../../assets/gifs/animationRadar.gif')} // Thay bằng link GIF radar của bạn
                  style={styless.radarGif}
                  resizeMode={FastImage.resizeMode.contain}
                />
              </View>
            </MapLibreGL.MarkerView>
          </MapLibreGL.MapView>
        </View>
        <View>
          <Button
            title="Mở Bottom Sheet"
            onPress={() => {
              bottomSheetRef.current?.expand();
            }}
          />
          <Button
            title="Đóng Bottom Sheet"
            onPress={() => {
              bottomSheetRef.current?.close();
            }}
          />
          {/* <Portal> */}
          {/* </Portal> */}
        </View>
      </Modal>

      {/* <BottomSheet ref={bottomSheetRef} snapPoints={['20%']} style={{flex: 1}}>
        <View
          style={{
            height: 200,
            backgroundColor: 'coral',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Button
            title="Đóng"
            onPress={() => bottomSheetRef.current?.close()}
          />
        </View>
      </BottomSheet> */}
    </>
  );
};

const styless = StyleSheet.create({
  markerContainer: {
    width: 400,
    height: 400,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radarGif: {
    width: 350,
    height: 350,
    position: 'absolute',
  },
  radarGif2: {
    width: 150,
    height: 150,
    position: 'absolute',
  },
});

export default ModalMapFindDriver;
