import {
  View,
  Image,
  Text,
  Modal,
  StatusBar,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
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
import LinearGradient from 'react-native-linear-gradient';
import {fontFamilies} from '../../constants/fontFamilies';
import {LocationModelSuggest} from '../../models/LocationModel';
import ItemSuggestLocation from '../../components/ItemSuggestLocation';
import {styles} from './ModalMapLocation.styles';

interface Props {
  visible: boolean;
  dataLocationSelected?: LocationModelSuggest | null;
  onCloseMap: () => void;
  onCloseAll?: () => void;
  onSelect: (val: LocationModelSuggest) => void;
}

MapLibreGL.setAccessToken(null); // Goong sử dụng API Key riêng
MapLibreGL.setConnected(true);

const loadMap =
  'https://tiles.goong.io/assets/goong_map_web.json?api_key=V0HS8KfYmnE7ZT2vA1ONH00H7NqKOTm7vu46U4cq';

const ModalMapLocation = (props: Props) => {
  const {visible, onCloseAll, onCloseMap, onSelect, dataLocationSelected} =
    props;

  const cameraRef = useRef<MapLibreGL.CameraRef>(null);
  const mapRef = useRef<MapLibreGL.MapViewRef>(null);
  const flatListRef = useRef<FlatList>(null);

  const [centerCoords, setCenterCoords] = useState<{
    latitude: number;
    longitude: number;
  }>({
    latitude: 20.980216,
    longitude: 105.772607,
  });
  const [centerCoordsCamera, setCenterCoordsCamera] = useState<{
    latitude: number;
    longitude: number;
  } | null>();
  const [zoomLevel, setZoomLevel] = useState<number>(17);
  const [locations, setLocations] = useState<LocationModelSuggest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [ischangeCamera, setIsChangeCamera] = useState(false);
  const [isScrollEnabled, setIsScrollEnabled] = useState(true);
  const [addressSelected, setAddressSelected] =
    useState<LocationModelSuggest | null>();

  const clearData = () => {
    setZoomLevel(17);
    setLocations([]);
    setIsLoading(false);
    setIsChangeCamera(false);
    setIsScrollEnabled(true);
    setCenterCoordsCamera(null);
    setAddressSelected(null);
    setCenterCoords({
      latitude: 20.980216,
      longitude: 105.772607,
    });
  };

  const fetchLocationCurrent = async () => {
    // console.log('abcd');

    await Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        // console.log('abc');

        setCenterCoords({latitude, longitude});
        // setStartCoords({latitude, longitude});
        // cameraRef.current?.setCamera({
        //   centerCoordinate: [longitude, latitude],
        //   zoomLevel: 17,
        //   animationDuration: 1000,
        // });
      },
      error => {
        if (error.code === 3) {
          console.log('Bỏ qua lỗi timeout do máy ảo không có GPS.');
          return;
        }
        console.error('Lỗi lấy vị trí:', error);
      },
      {},
      // {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  };

  const fetchLocationChoiced = async ({
    lat,
    long,
  }: {
    lat: number;
    long: number;
  }) => {
    const api = `https://rsapi.goong.io/Geocode?latlng=${lat},${long}&api_key=crMmofRW2lgZNiDMZtCUdYqHZfGZv1cVZ864e0CR`;

    try {
      const res = await axios.get(api);

      if (res && res.status === 200 && res.data.results.length > 0) {
        const dataSaveLocation = res.data.results.map((e: any) => ({
          description: e.address,
          main_name_place: e.name,
          place_id: e.place_id,
          latitude: e.geometry.location.lat,
          longitude: e.geometry.location.lng,
        }));

        setLocations(dataSaveLocation);
        setAddressSelected(dataSaveLocation[0]);

        checkCameraExist({
          latitude: res.data.results[0].geometry.location.lat,
          longitude: res.data.results[0].geometry.location.lng,
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRegionChange = (e: any) => {
    const {geometry, properties} = e;
    // console.log(ischangeCamera);

    if (!ischangeCamera) {
      setIsLoading(true);
      setZoomLevel(properties.zoomLevel);
      setCenterCoords({
        latitude: geometry.coordinates[1],
        longitude: geometry.coordinates[0],
      });
      setCenterCoordsCamera(null);
      // setEndCoords({
      //   latitude: geometry.coordinates[1],
      //   longitude: geometry.coordinates[0],
      // });
    } else {
      setIsScrollEnabled(true);
    }
  };

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 100, // Phần tử phải hiển thị ít nhất 50% để được coi là visible
  };

  const onViewableItemsChanged = async (viewableItems: any) => {
    const offsetY = viewableItems.nativeEvent.contentOffset.y; // Lấy vị trí cuộn dọc
    const itemHeight = 60; // Chiều cao mỗi item (bạn có thể tự tính toán hoặc cố định)
    const index = Math.round(offsetY / itemHeight); // Xác định index của phần tử

    await setIsChangeCamera(true);
    if (locations[index].latitude && locations[index].longitude) {
      setAddressSelected(locations[index]);
      checkCameraExist({
        latitude: locations[index].latitude,
        longitude: locations[index].longitude,
      });
    }
  };

  const handleItemPress = (index: number) => {
    setAddressSelected(locations[index]);

    // Chỉ cuộn lên đầu danh sách mà không thay đổi thứ tự
    flatListRef.current?.scrollToIndex({index: index, animated: true});
  };

  const changeCamera = async () => {
    if (centerCoordsCamera) {
      await setIsChangeCamera(true);
    }
  };

  const checkCameraExist = (newCoords: {
    longitude: number;
    latitude: number;
  }) => {
    if (
      centerCoordsCamera !== null &&
      centerCoordsCamera !== undefined &&
      centerCoordsCamera.longitude === newCoords.longitude &&
      centerCoordsCamera.latitude === newCoords.latitude
    ) {
      console.log('Camera tọa độ không thay đổi');
      setIsScrollEnabled(true);
      return;
    }

    // Cập nhật tọa độ camera
    setCenterCoordsCamera(newCoords);
  };

  // useFocusEffect(
  //   useCallback(() => {
  //     fetchLocationCurrent();
  //   }, []),
  // );

  useEffect(() => {
    if (visible) {
      if (!dataLocationSelected) {
        // console.log('abc1');

        fetchLocationCurrent();
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
    changeCamera();
  }, [centerCoordsCamera]);

  useEffect(() => {
    fetchLocationChoiced({
      lat: centerCoords.latitude,
      long: centerCoords.longitude,
    });
  }, [centerCoords]);

  // console.log(locations);

  return (
    <Modal
      animationType="slide"
      visible={visible}
      transparent={true}
      statusBarTranslucent={true}
      style={{flex: 1, position: 'relative'}}>
      <StatusBar
        barStyle="dark-content"
        translucent={true}
        backgroundColor="#ffffff"
      />
      <SectionComponent styles={[globalStyles.noSpaceCard, styles.buttonBack]}>
        <CardComponent
          onPress={() => {
            onCloseMap();
            clearData();
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
          // styleJSON=''
          // scrollEnabled={false}
          // onRegionIsChanging={event => checkCameraForFlastlist(event)}
          compassEnabled={false}
          ref={mapRef}
          // tintColor="black"

          onRegionWillChange={() => setIsScrollEnabled(false)}
          onRegionDidChange={async e => {
            await handleRegionChange(e);
            ischangeCamera && setIsChangeCamera(false);
          }}
          zoomEnabled={true}
          onPress={() => console.log('Map Pressed')}>
          <MapLibreGL.Camera
            ref={cameraRef}
            animationDuration={100}
            centerCoordinate={
              centerCoordsCamera
                ? [centerCoordsCamera.longitude, centerCoordsCamera.latitude]
                : [centerCoords.longitude, centerCoords.latitude]
            }
            zoomLevel={zoomLevel}
          />
          <MapLibreGL.UserLocation />
          {locations.map((item, index) => (
            <View key={`${item.place_id}${index}`}>
              {item.longitude && item.latitude && (
                <MapLibreGL.PointAnnotation
                  id={item.place_id || index.toString()}
                  coordinate={[item.longitude, item.latitude]} // Tọa độ marker
                >
                  {/* Custom marker (tuỳ chỉnh biểu tượng marker) */}
                  <View style={[styles.marker, {backgroundColor: '#6633FF'}]} />
                </MapLibreGL.PointAnnotation>
              )}
            </View>
          ))}
        </MapLibreGL.MapView>
      </View>
      <View style={styles.markerFixed}>
        <Image
          source={require('../../assets/images/icons_pickupmarker.png')}
          style={{
            width: 55,
            height: 55,
          }}
        />
      </View>

      <View style={styles.heighFrameChoiceLocation}>
        {/* Gradient tạo bóng */}
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: -6,
          }}>
          <LinearGradient
            colors={['transparent', 'rgba(0, 0, 0, 0.2)']} // Từ đậm tới trong suốt
            style={styles.linearGradient}
          />
        </View>
        {/* View chính */}
        <View
          style={{
            backgroundColor: appColors.WhiteSmoke,
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            height: '100%',
          }}>
          <View style={styles.titleFrameChoiceLocation}>
            <TextComponent
              text="Choice your location"
              size={17}
              font={fontFamilies.medium}></TextComponent>
          </View>

          <View
            style={{
              height: ' 52%',

              marginTop: 8,
              position: 'relative',
            }}>
            {!isLoading && (
              <View style={styles.frame}>
                <View style={styles.frameChild}></View>
              </View>
            )}
            <SectionComponent
              styles={{
                flex: 1,
                paddingHorizontal: 27,
                paddingBottom: 0,
              }}>
              {isLoading ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <ActivityIndicator />
                </View>
              ) : locations.length > 0 ? (
                <FlatList
                  showsVerticalScrollIndicator={false}
                  snapToInterval={60}
                  ref={flatListRef}
                  style={{marginBottom: -8}}
                  // onScroll={handleScroll}
                  data={locations}
                  decelerationRate="fast"
                  snapToAlignment="start"
                  scrollEnabled={isScrollEnabled}
                  viewabilityConfig={viewabilityConfig}
                  onMomentumScrollEnd={onViewableItemsChanged}
                  renderItem={({item, index}) => (
                    <ItemSuggestLocation
                      item={item}
                      key={`${item.place_id}${index}`}
                      // setAddressSelected={val =>
                      //   setAddressSelected(val)
                      // }

                      numberLineTitle={1}
                      onPress={() => {
                        isScrollEnabled && setIsScrollEnabled(false);
                        isScrollEnabled && setIsChangeCamera(true);
                        isScrollEnabled && handleItemPress(index);
                      }}
                      setCenterCoordsCamera={val =>
                        isScrollEnabled && checkCameraExist(val)
                      }></ItemSuggestLocation>
                  )}
                  ListFooterComponent={<View style={{height: 100}} />}
                />
              ) : (
                <View>
                  <TextComponent text={'Not data.'} />
                </View>
              )}
            </SectionComponent>
          </View>
          <View style={styles.frameButton}>
            <ButtonComponent
              onPress={() => {
                addressSelected && onSelect(addressSelected);
                addressSelected && onCloseMap();
                clearData();
                onCloseAll && onCloseAll();
              }}
              styles={{paddingVertical: 12}}
              type="primary"
              disable={!isScrollEnabled}
              color={
                isScrollEnabled
                  ? appColors.BlueDarkTurquoise
                  : appColors.DarkSlateGrayBlue4
              }
              iconFlex="left"
              text={
                isScrollEnabled ? 'Confirm location' : 'System is processing'
              }></ButtonComponent>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ModalMapLocation;
