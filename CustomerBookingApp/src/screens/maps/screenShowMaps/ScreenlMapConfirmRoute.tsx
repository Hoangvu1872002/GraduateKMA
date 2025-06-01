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
  ItemSelectVehicel,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '../../../components';
import {globalStyles} from '../../../styles/globalStyles';
import {
  ArrowCircleLeft2,
  HambergerMenu,
  Location,
  Moneys,
  Tag2,
} from 'iconsax-react-native';
import {appColors} from '../../../constants/appColors';
import MapLibreGL from '@maplibre/maplibre-react-native';
import Geolocation from '@react-native-community/geolocation';
import {useFocusEffect} from '@react-navigation/native';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
import {fontFamilies} from '../../../constants/fontFamilies';
import {LocationModelSuggest} from '../../../models/LocationModel';
import ItemSuggestLocation from '../../../components/ItemSuggestLocation';
import {styles} from './ModalMapLocation.styles';
import {FeatureCollection, Feature, LineString, Point} from 'geojson';
import data from '../../../constants/data';
import {apiGetAllDriverNearby} from '../../../apis';
import {ItemSelectVehicle} from '../../../models/SelectModel';
import {useSelector} from 'react-redux';
import {RootState} from '../../../stores/redux';

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface Driver {
  _id: string;
  travelMode: string;
  latitude: number;
  longitude: number;
}

// Định nghĩa kiểu dữ liệu cho điểm (Point) trong GeoJSON
interface PointFeature extends FeatureCollection {
  features: {
    type: 'Feature';
    geometry: Point;
    properties: {icon: string};
  }[];
}

// Hàm tạo dữ liệu GeoJSON từ pickup & destination
const pickupIcon = require('../../../assets/images/ic_map_ic_pick.png');
const destinationIcon = require('../../../assets/images/icons_pickupmarker.png');
const bikeIcon = require('../../../assets/images/img_vespa_top.png');
const carIcon = require('../../../assets/images/car.png');

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

MapLibreGL.setAccessToken(null); // Goong sử dụng API Key riêng
MapLibreGL.setConnected(true);

const loadMap =
  'https://tiles.goong.io/assets/goong_map_web.json?api_key=V0HS8KfYmnE7ZT2vA1ONH00H7NqKOTm7vu46U4cq';

const ModalMapConfirnRoute = ({navigation, route}: any) => {
  const {
    addressSelectedPickup,
    addressSelectedDestination,
  }: {
    addressSelectedPickup: LocationModelSuggest;
    addressSelectedDestination: LocationModelSuggest;
  } = route?.params;

  const {current, stateSelectVehicle} = useSelector(
    (state: RootState) => state.user,
  );

  const filteredItemSelectVehicle =
    !stateSelectVehicle || stateSelectVehicle === 'delivery'
      ? data.itemSelectVehicle
      : data.itemSelectVehicle.filter(item => item.type === stateSelectVehicle);

  const cameraRef = useRef<MapLibreGL.CameraRef | null>(null);
  const mapRef = useRef<MapLibreGL.MapViewRef>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(16);
  const [isLoading, setIsLoading] = useState(false);
  const [geoJSONData, setGeoJSONData] =
    useState<FeatureCollection<LineString> | null>(null);
  const [geoJSONDataDriver, setGeoJSONDataDriver] =
    useState<FeatureCollection<Point> | null>(null);
  const [driversDataNearby, setDriversDataNearby] = useState<Driver[]>([]);
  const [geoJSONPoints, setGeoJSONPoints] = useState<PointFeature | null>(null);
  const [itemFocusing, setItemFocusing] = useState<string>('1');
  const [totalDistance, setTotalDistance] = useState(0);
  const [filteredDriversNearby, setFilteredDriversNearby] = useState<Driver[]>(
    [],
  );
  const [itemSelectVehicleSelected, setItemSelectVehicleSelected] =
    useState<ItemSelectVehicle | null>(filteredItemSelectVehicle[0]);

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

  const fetchRoute = async () => {
    try {
      const response = await axios.get('https://rsapi.goong.io/Direction', {
        params: {
          origin: `${addressSelectedPickup.latitude},${addressSelectedPickup.longitude}`,
          destination: `${addressSelectedDestination.latitude},${addressSelectedDestination.longitude}`,
          vehicle: 'bike',
          api_key: 'crMmofRW2lgZNiDMZtCUdYqHZfGZv1cVZ864e0CR',
        },
      });

      const route = response.data.routes[0].overview_polyline.points;
      const decodedRoute = decodePolyline(route); // Giải mã polyline
      setTotalDistance(response.data.routes[0].legs[0].distance.value); // đơn vị: mét
      // console.log(`Tổng quãng đường: ${totalDistance} m`);
      const data: FeatureCollection<LineString> = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: decodedRoute,
            },
            properties: {},
          },
        ],
      };

      setGeoJSONData(data);

      // setCenterCoords(undefined);

      setTimeout(async () => {
        await cameraRef.current?.fitBounds(
          [
            addressSelectedPickup.longitude ?? 0,
            addressSelectedPickup.latitude ?? 0,
          ],
          [
            addressSelectedDestination.longitude ?? 0,
            addressSelectedDestination.latitude ?? 0,
          ],
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

  const fetchDriverNearby = async () => {
    if (
      addressSelectedPickup.latitude &&
      addressSelectedPickup.longitude &&
      addressSelectedDestination.latitude &&
      addressSelectedDestination.longitude
    ) {
      const rs = await apiGetAllDriverNearby({
        latitude: addressSelectedPickup.latitude,
        longitude: addressSelectedPickup.longitude,
      });
      setDriversDataNearby(rs.data);
    }
  };

  useEffect(() => {
    console.log(itemSelectVehicleSelected?.type);

    setFilteredDriversNearby(
      driversDataNearby.filter(
        driver => driver.travelMode === itemSelectVehicleSelected?.type,
      ),
    );
  }, [itemSelectVehicleSelected, driversDataNearby]);

  useEffect(() => {
    setItemFocusing(itemSelectVehicleSelected?.id || '1');
    fetchRoute();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (
        addressSelectedPickup.latitude &&
        addressSelectedPickup.longitude &&
        addressSelectedDestination.latitude &&
        addressSelectedDestination.longitude
      ) {
        const pointData = getPointData(
          {
            latitude: addressSelectedPickup.latitude,
            longitude: addressSelectedPickup.longitude,
          },
          {
            latitude: addressSelectedDestination.latitude,
            longitude: addressSelectedDestination.longitude,
          },
        );
        fetchDriverNearby();
        setGeoJSONPoints(pointData);
      }
    }, 500);
  }, [addressSelectedPickup, addressSelectedDestination]);

  useEffect(() => {
    if (filteredDriversNearby?.length > 0) {
      const features: Feature<Point>[] = filteredDriversNearby.map(driver => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [driver.longitude, driver.latitude], // MapLibreGL yêu cầu [lng, lat]
        },
        properties: {
          id: driver._id,
          travelMode: driver.travelMode,
          rotation: Math.random() * 180, // Góc ngẫu nhiên từ 0 đến 360 độ
        },
      }));

      setGeoJSONDataDriver({
        type: 'FeatureCollection',
        features,
      });
    } else {
      setGeoJSONDataDriver({
        type: 'FeatureCollection',
        features: [],
      });
    }
  }, [filteredDriversNearby]);

  return (
    <>
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
          <View
            style={[
              globalStyles.shadow,
              {
                backgroundColor: appColors.white,
                top: 43,
                width: '72%',
                position: 'absolute',
                right: 30,
                zIndex: 10,
                paddingLeft: 8,
                paddingRight: 5,
                paddingVertical: 5,
                borderRadius: 10,
              },
            ]}>
            <RowComponent
              styles={{
                width: '97%',
                borderRightWidth: 1,
                borderRightColor: appColors.DarkSlateGrayBlue4,
              }}
              justify="flex-start">
              <Image
                source={require('../../../assets/images/icons_ico_map_pin.png')}
                style={{
                  width: 16,
                  height: 16,
                  resizeMode: 'cover',
                }}
              />
              <SpaceComponent width={7}></SpaceComponent>
              <TextComponent
                styles={{maxWidth: '90%'}}
                size={11}
                numOfLine={1}
                font={fontFamilies.medium}
                text={`${addressSelectedPickup.main_name_place} ${
                  addressSelectedPickup.description ? ',' : ''
                } ${addressSelectedPickup.description || ''}`}></TextComponent>
            </RowComponent>
            <SpaceComponent height={3}></SpaceComponent>
            <RowComponent
              justify="flex-start"
              styles={{
                width: '97%',
                borderRightWidth: 1,
                borderRightColor: appColors.DarkSlateGrayBlue4,
              }}>
              <Location size="16" color="#FF8A65" variant="Bold" />
              <SpaceComponent width={7}></SpaceComponent>
              <TextComponent
                styles={{maxWidth: '90%'}}
                numOfLine={1}
                font={fontFamilies.medium}
                size={11}
                text={`${addressSelectedDestination.main_name_place} ${
                  addressSelectedDestination.description ? ',' : ''
                } ${
                  addressSelectedDestination.description || ''
                }`}></TextComponent>
            </RowComponent>
          </View>
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
                    lineWidth: 9, // Lớn hơn đường chính
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
            {geoJSONDataDriver && (
              <MapLibreGL.ShapeSource
                id="driversSource"
                shape={geoJSONDataDriver}>
                <MapLibreGL.SymbolLayer
                  id="driversLayer"
                  style={{
                    iconImage: [
                      'match',
                      ['get', 'travelMode'],
                      'Bike',
                      'bikeIcon',
                      'Car',
                      'carIcon',
                      'BikePlus',
                      'bikeIcon',
                      'CarFamily',
                      'carIcon',
                      'defaultIcon', // Giá trị mặc định nếu không khớp
                    ],
                    iconSize: 0.2,
                    iconAllowOverlap: true,
                    iconRotate: ['get', 'rotation'], // Lấy giá trị xoay từ properties
                  }}
                />
              </MapLibreGL.ShapeSource>
            )}
          </MapLibreGL.MapView>
        </View>

        <View style={styles.heighFrameChoiceLocation2}>
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

          <View
            style={{
              backgroundColor: appColors.WhiteSmoke,
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              height: '100%',
            }}>
            <View
              style={{
                height: '65%',
                marginTop: 12,
                // backgroundColor: 'green',
                position: 'relative',
              }}>
              <SectionComponent
                styles={{
                  flex: 1,
                  paddingHorizontal: 20,
                  // marginTop: 5,
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
                ) : (
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    style={{marginBottom: -8}}
                    data={filteredItemSelectVehicle}
                    // viewabilityConfig={viewabilityConfig}
                    renderItem={({item, index}) => (
                      <ItemSelectVehicel
                        totalDistance={totalDistance}
                        item={item}
                        onPress={(val: string) => {
                          setItemFocusing(val);
                          setItemSelectVehicleSelected(item);
                        }}
                        itemFocusing={itemFocusing}></ItemSelectVehicel>
                    )}
                  />
                )}
              </SectionComponent>
            </View>
            <View style={styles.frameButton2}>
              <RowComponent styles={{paddingHorizontal: 10}}>
                <RowComponent
                  styles={{
                    width: '40%',
                    borderRightWidth: 0.8,
                    borderRightColor: appColors.gray2,
                  }}
                  justify="flex-start">
                  <Moneys size="20" variant="Bulk" color="#FF8A65" />
                  <SpaceComponent width={10}></SpaceComponent>
                  <TextComponent
                    text="Cash"
                    // color={appColors.text2}
                    font={fontFamilies.medium}
                    size={12}></TextComponent>
                </RowComponent>
                <SpaceComponent width={8}></SpaceComponent>
                <RowComponent
                  styles={{
                    width: '43%',
                    borderRightWidth: 0.8,
                    borderRightColor: appColors.gray2,
                  }}
                  justify="flex-start">
                  <Tag2 size="20" color="#FF8A65" variant="Bold" />
                  <SpaceComponent width={10}></SpaceComponent>
                  <TextComponent
                    text="Discount 35%..."
                    // color={appColors.text2}
                    font={fontFamilies.medium}
                    size={12}></TextComponent>
                </RowComponent>
                <SpaceComponent width={5}></SpaceComponent>
                <HambergerMenu size="20" color="#FF8A65" variant="Bulk" />
              </RowComponent>
              <SpaceComponent height={10}></SpaceComponent>
              <RowComponent justify="space-between">
                <View
                  style={{
                    width: '35%',

                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: 10,
                  }}>
                  <RowComponent
                    styles={{
                      padding: 10,
                      width: '65%',
                      backgroundColor: appColors.gray2,
                      borderWidth: 1,
                      borderRadius: 12,
                      borderColor: appColors.gray4,
                    }}>
                    <TextComponent
                      font={fontFamilies.semiBold}
                      color={appColors.BlueDarkTurquoise}
                      text="Vivu Trip"></TextComponent>
                  </RowComponent>
                </View>
                <ButtonComponent
                  width={'95%'}
                  onPress={() => {
                    navigation.replace('ScreenMapFindDriver', {
                      addressSelectedPickup,
                      addressSelectedDestination,
                      totalDistance,
                      itemSelectVehicleSelected,
                      current,
                    });
                  }}
                  styles={{paddingVertical: 10, marginBottom: 0}}
                  type="primary"
                  //   disable={!isScrollEnabled}
                  color={appColors.BlueDarkTurquoise}
                  text={'Book now'}></ButtonComponent>
              </RowComponent>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

export default ModalMapConfirnRoute;
