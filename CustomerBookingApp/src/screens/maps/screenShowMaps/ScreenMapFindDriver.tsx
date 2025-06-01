import {View, Modal, StatusBar, StyleSheet, Image, Button} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ButtonComponent,
  CardComponent,
  ContainerComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '../../../components';
import {globalStyles} from '../../../styles/globalStyles';
import {
  ArrowCircleLeft2,
  Location,
  Moneys,
  Profile2User,
} from 'iconsax-react-native';
import {appColors} from '../../../constants/appColors';
import MapLibreGL from '@maplibre/maplibre-react-native';
import {fontFamilies} from '../../../constants/fontFamilies';
import {LocationModelSuggest} from '../../../models/LocationModel';
import FastImage from 'react-native-fast-image';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';

import {styles} from './ModalMapLocation.styles';
// import {Portal} from 'react-native-portalize';
import BottomSheet from '@gorhom/bottom-sheet';
import socket from '../../../apis/socket';

MapLibreGL.setAccessToken(null); // Goong sử dụng API Key riêng
MapLibreGL.setConnected(true);

const loadMap =
  'https://tiles.goong.io/assets/goong_map_web.json?api_key=K4Wf0bYa0I5v8wxWCjRmeohWKjmHaHr9j2jwfImc';

const ScreenMapFindDriver = ({navigation, route}: any) => {
  const {
    addressSelectedPickup,
    addressSelectedDestination,
    totalDistance,
    itemSelectVehicleSelected,
    current,
  }: {
    addressSelectedPickup: LocationModelSuggest;
    addressSelectedDestination: LocationModelSuggest;
    totalDistance: number;
    itemSelectVehicleSelected: any;
    current: any;
  } = route?.params;

  // console.log(totalDistance, itemSelectVehicleSelected);

  const cameraRef = useRef<MapLibreGL.CameraRef>(null);
  const mapRef = useRef<MapLibreGL.MapViewRef>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [centerCoords, setCenterCoords] = useState<{
    latitude: number;
    longitude: number;
  }>({
    latitude: 20.980216,
    longitude: 105.772607,
  });

  const [zoomLevel, setZoomLevel] = useState<number>(15);
  const [idNewOrder, setIdNewOrder] = useState('');

  useEffect(() => {
    socket.on('notice-driver-receipted-order', data => {
      navigation.replace('ScreenMapFollowDriver', {data: data.billWithDriver});
    });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (bottomSheetRef.current) {
        bottomSheetRef.current.expand(); // Mở BottomSheet khi modal được mở
      }
    }, 200);
    if (!addressSelectedPickup) {
    } else if (
      addressSelectedPickup &&
      addressSelectedPickup.latitude &&
      addressSelectedPickup.longitude
    ) {
      setCenterCoords({
        latitude: addressSelectedPickup.latitude,
        longitude: addressSelectedPickup.longitude,
      });
    } else {
      console.log('abc3');
    }
  }, []);

  useEffect(() => {
    socket.on('id-new-order', data => {
      setIdNewOrder(data);
    });

    socket.emit('find-driver', {
      addressSelectedPickup,
      addressSelectedDestination,
      totalDistance,
      typeVehicleSelected: itemSelectVehicleSelected.type,
      costVehicleSelected: itemSelectVehicleSelected.costCoefficient,
      averageTimeVehicleSelected: itemSelectVehicleSelected.averageTime,
      infCustomer: current,
    });
  }, []);

  return (
    <View style={{flex: 1, position: 'relative'}}>
      <View style={{height: '75%', position: 'relative'}}>
        <StatusBar
          barStyle="dark-content"
          translucent={true}
          backgroundColor="transparent"
        />
        <SectionComponent
          styles={[globalStyles.noSpaceCard, styles.buttonBack]}>
          <CardComponent
            onPress={() => {
              socket.emit('notice-remove-order-from-user', idNewOrder);
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
            <MapLibreGL.MarkerView
              coordinate={[
                addressSelectedPickup.longitude ?? centerCoords.longitude,
                addressSelectedPickup?.latitude ?? centerCoords.latitude,
              ]}>
              <View style={styless.markerContainer}>
                <FastImage
                  source={require('../../../assets/gifs/animationRadar4.gif')} // Thay bằng link GIF radar của bạn
                  style={styless.radarGif2}
                  resizeMode={FastImage.resizeMode.contain}
                />
              </View>
            </MapLibreGL.MarkerView>
            <MapLibreGL.MarkerView
              coordinate={[
                addressSelectedPickup.longitude ?? centerCoords.longitude,
                addressSelectedPickup?.latitude ?? centerCoords.latitude,
              ]}>
              <View style={styless.markerContainer}>
                <FastImage
                  source={require('../../../assets/gifs/animationRadar3.gif')} // Thay bằng link GIF radar của bạn
                  style={styless.radarGif}
                  resizeMode={FastImage.resizeMode.contain}
                />
              </View>
            </MapLibreGL.MarkerView>

            {/* <MapLibreGL.MarkerView
              coordinate={[
                addressSelectedPickup.longitude ?? centerCoords.longitude,
                addressSelectedPickup?.latitude ?? centerCoords.latitude,
              ]}>
              <View style={styless.markerContainer}>
                <FastImage
                  source={require('../../../assets/gifs/animationRadar.gif')} // Thay bằng link GIF radar của bạn
                  style={styless.radarGif}
                  resizeMode={FastImage.resizeMode.contain}
                />
              </View>
            </MapLibreGL.MarkerView> */}
          </MapLibreGL.MapView>
        </View>
      </View>

      <BottomSheetModalProvider>
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={[
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
                text="Looking for a driver for you"></TextComponent>
              <SpaceComponent height={5}></SpaceComponent>
              <TextComponent
                font={fontFamilies.regular}
                size={11}
                color={appColors.gray}
                text={itemSelectVehicleSelected.name}></TextComponent>
              <SpaceComponent height={9}></SpaceComponent>
              <View
                style={{
                  height: 3,
                  width: '100%',
                  backgroundColor: appColors.BlueDarkTurquoise,
                  borderRadius: 100,
                }}></View>
              <SpaceComponent height={9}></SpaceComponent>
              <RowComponent styles={{width: '100%'}} justify="flex-start">
                <CardComponent
                  styles={[
                    globalStyles.noSpaceCard,
                    {width: 43, height: 43, borderRadius: 10},
                  ]}>
                  <Image
                    source={itemSelectVehicleSelected.image}
                    style={{
                      flex: 1,
                      width: 45,
                    }}
                  />
                </CardComponent>
                <SpaceComponent width={15}></SpaceComponent>

                <RowComponent styles={{flex: 1}} justify="space-between">
                  <View style={{width: '45%'}}>
                    <TextComponent
                      size={13}
                      numOfLine={1}
                      font={fontFamilies.semiBold}
                      text={itemSelectVehicleSelected.name}
                    />
                    <RowComponent justify="flex-start">
                      <Profile2User size="12" color={appColors.text} />
                      <SpaceComponent width={3} />
                      <TextComponent
                        numOfLine={2}
                        size={12}
                        text={itemSelectVehicleSelected.numberSeat.toString()}
                      />
                      <SpaceComponent width={3} />
                      <TextComponent numOfLine={2} size={12} text="->" />
                      <SpaceComponent width={3} />
                      <TextComponent
                        numOfLine={2}
                        size={12}
                        text={itemSelectVehicleSelected.description}
                      />
                    </RowComponent>
                  </View>
                  <View style={{width: '20%'}}>
                    <TextComponent
                      flex={0}
                      styles={{justifyContent: 'flex-end'}}
                      font={fontFamilies.semiBold}
                      size={13}
                      text={`${(
                        itemSelectVehicleSelected.costCoefficient *
                        totalDistance *
                        0.001
                      ).toFixed(2)} $`}
                    />
                    <TextComponent
                      flex={0}
                      font={fontFamilies.medium}
                      color={appColors.gray4}
                      size={10}
                      styles={{textDecorationLine: 'line-through'}}
                      text={`${(
                        itemSelectVehicleSelected.costCoefficient *
                        1.5 *
                        totalDistance *
                        0.001
                      ).toFixed(2)} $`}
                    />
                  </View>
                </RowComponent>
              </RowComponent>
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
                    // styles={{maxWidth: '90%'}}
                    // size={13}
                    numOfLine={1}
                    font={fontFamilies.medium}
                    text={
                      addressSelectedPickup.main_name_place
                    }></TextComponent>
                  <SpaceComponent height={4}></SpaceComponent>
                  <TextComponent
                    // styles={{maxWidth: '90%'}}
                    size={11}
                    numOfLine={1}
                    font={fontFamilies.regular}
                    text={
                      addressSelectedPickup.description ||
                      'Not data for description'
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
                    text={
                      addressSelectedDestination.main_name_place
                    }></TextComponent>
                  <SpaceComponent height={4}></SpaceComponent>
                  <TextComponent
                    // styles={{maxWidth: '90%'}}
                    size={11}
                    numOfLine={1}
                    font={fontFamilies.regular}
                    text={
                      addressSelectedDestination.description ||
                      'Not data for description'
                    }></TextComponent>
                </View>
              </RowComponent>
            </SectionComponent>
            <SectionComponent>
              <SpaceComponent height={8}></SpaceComponent>
              <RowComponent
                styles={{
                  width: '40%',
                  // borderRightWidth: 0.8,
                  // borderRightColor: appColors.gray2,
                }}
                justify="flex-start">
                <Moneys size="20" variant="Bulk" color="green" />
                <SpaceComponent width={10}></SpaceComponent>
                <TextComponent
                  text="Pay in cash"
                  // color={appColors.text2}
                  font={fontFamilies.medium}
                  size={13}></TextComponent>
              </RowComponent>
              <View
                style={{
                  width: '100%',
                  height: 100,
                  justifyContent: 'center',
                  alignItems: 'center',
                  // backgroundColor: 'coral',
                }}>
                {/* <TextComponent text="abc"></TextComponent> */}
                <ButtonComponent
                  width={118}
                  onPress={() => {
                    socket.emit('notice-remove-order-from-user', idNewOrder);
                    navigation.goBack();
                  }}
                  styles={{paddingVertical: 7}}
                  color={appColors.red}
                  type="primary"
                  textStyles={{flex: 0}}
                  text="Cancel Trip"></ButtonComponent>
              </View>
            </SectionComponent>
          </BottomSheetView>
        </BottomSheet>
      </BottomSheetModalProvider>
    </View>
  );
};

const styless = StyleSheet.create({
  markerContainer: {
    width: 400,
    height: 400,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
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

export default ScreenMapFindDriver;
