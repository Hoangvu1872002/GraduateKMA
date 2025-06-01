import GeoLocation from '@react-native-community/geolocation';
import axios from 'axios';
import {
  Convertshape2,
  Location,
  Map,
  Map1,
  SearchNormal1,
} from 'iconsax-react-native';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
// import GeoCoder from 'react-native-geocoding';
// import MapView from 'react-native-maps';
import {
  ButtonComponent,
  CardComponent,
  ContainerComponent,
  InputComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '../../components';
import {appColors} from '../../constants/appColors';
import {appInfo} from '../../constants/appInfos';
import {LocationModelSuggest} from '../../models/LocationModel';
import {globalStyles} from '../../styles/globalStyles';
import useDebounce from '../../hooks/useDebounce';
import {fontFamilies} from '../../constants/fontFamilies';
import ItemSuggestLocation from '../../components/ItemSuggestLocation';
import dataFake from '../../constants/data';
import {ScrollView} from 'react-native-gesture-handler';
import Geolocation from '@react-native-community/geolocation';
import ModalMapLocation from '../modalMap/ModalMapLocation';
import ModalMapConfirnRoute from '../../screens/maps/screenShowMaps/ScreenlMapConfirmRoute';

// GeoCoder.init(process.env.MAP_API_KEY as string);

interface Props {
  visible: boolean;

  onClose: () => void;
  onSelect: (val: LocationModelSuggest) => void;
}

const ModalLocationBooking = (props: Props) => {
  const {visible, onClose, onSelect} = props;
  const [searchKeyPickup, setSearchKeyPickup] = useState('');
  const [searchKeyDestination, setSearchKeyDestination] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [locationsPickup, setLocationsPickup] = useState<
    LocationModelSuggest[]
  >([]);
  const [locationsDestination, setLocationsDestination] = useState<
    LocationModelSuggest[]
  >([]);
  const [addressSelectedPickup, setAddressSelectedPickup] =
    useState<LocationModelSuggest | null>();
  const [addressSelectedDestination, setAddressSelectedDestination] =
    useState<LocationModelSuggest | null>();
  const [checkSelectedPickup, setCheckSelectedPickup] =
    useState<LocationModelSuggest | null>();
  const [checkSelectedDestination, setCheckSelectedDestination] =
    useState<LocationModelSuggest | null>();
  const [placeIdSelected, setPlaceIdSelected] = useState('');
  const [autoFocus, setAutoFocust] = useState(true);
  const [inputFocusing, setInputFocusing] = useState(3);
  const [isVibleModalMapLocation, setIsVibleModalMapLocation] = useState(false);
  const [isVibleModalConfirmRoute, setIsVibleModalConfirmRoute] =
    useState(false);

  const [currentLocation, setCurrentLocation] =
    useState<LocationModelSuggest>();

  const debouncedInputPickup = useDebounce(searchKeyPickup, 1000);
  const debouncedInputDestination = useDebounce(searchKeyDestination, 1000);

  useEffect(() => {
    // console.log(addressSelected);
    if (placeIdSelected) {
      fetchCoordinatesFromPlaceId(placeIdSelected);
    }
  }, [placeIdSelected]);

  const handleClose = () => {
    onClose();
  };

  // console.log(addressSelectedPickup);
  // console.log(addressSelectedDestination);

  const handleSearchLocation = async (query: string) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        'https://rsapi.goong.io/Place/AutoComplete',
        {
          params: {
            api_key: 'crMmofRW2lgZNiDMZtCUdYqHZfGZv1cVZ864e0CR',
            input: query,
          },
        },
      );

      if (response.status === 200) {
        // console.log(response.data);

        const dataSaveLocation = response.data.predictions.map((e: any) => ({
          description: e.structured_formatting.secondary_text,
          main_name_place: e.structured_formatting.main_text,
          place_id: e.place_id,
        }));
        if (inputFocusing === 2) {
          setLocationsPickup(dataSaveLocation);
        } else if (inputFocusing === 3) {
          setLocationsDestination(dataSaveLocation);
        } else {
          console.log('looix roif');
        }

        // console.log(dataSaveLocation);
        setIsLoading(false);
      } else {
        console.log('err');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching autocomplete suggestions:', error);
      setIsLoading(false);
    }
  };

  const fetchCoordinatesFromPlaceId = async (placeId: string) => {
    const API_KEY = 'crMmofRW2lgZNiDMZtCUdYqHZfGZv1cVZ864e0CR'; // Thay bằng API Key của bạn
    const BASE_URL = 'https://rsapi.goong.io/Place/Detail';

    try {
      // Gọi API Place Detail
      const response = await axios.get(BASE_URL, {
        params: {
          place_id: placeId,
          api_key: API_KEY,
        },
      });

      if (response.status === 200) {
        const {lat, lng} = response.data.result.geometry.location;

        inputFocusing === 2
          ? setCheckSelectedPickup(prev => {
              if (!prev) return undefined; // Nếu `prev` undefined, trả về undefined

              return {
                ...prev,
                latitude: lat,
                longitude: lng,
                place_id: prev.place_id ?? '', // Đảm bảo giá trị không undefined
                description: prev.description ?? '', // Đảm bảo giá trị không undefined
                main_name_place: prev.main_name_place ?? '', // Đảm bảo giá trị không undefined
              };
            })
          : setCheckSelectedDestination(prev => {
              if (!prev) return undefined; // Nếu `prev` undefined, trả về undefined

              return {
                ...prev,
                latitude: lat,
                longitude: lng,
                place_id: prev.place_id ?? '', // Đảm bảo giá trị không undefined
                description: prev.description ?? '', // Đảm bảo giá trị không undefined
                main_name_place: prev.main_name_place ?? '', // Đảm bảo giá trị không undefined
              };
            });

        setIsVibleModalMapLocation(true);

        // setCurrentLocation({
        //   lat: lat,
        //   long: lng,
        //   addressName: response.data.result.formatted_address,
        // });
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
    }
  };

  const reverseGeoCode = async ({lat, long}: {lat: number; long: number}) => {
    // console.log(lat, long);

    const api = `https://rsapi.goong.io/Geocode?latlng=${lat},${long}&api_key=crMmofRW2lgZNiDMZtCUdYqHZfGZv1cVZ864e0CR`;

    try {
      const res = await axios.get(api);

      // console.log(res);

      if (res && res.status === 200 && res.data.results[0]) {
        const items = res.data.results[0];
        setSearchKeyPickup(items.name);

        setAddressSelectedPickup({
          place_id: items.place_id,
          description: items.adrress,
          main_name_place: items.name,
          latitude: lat,
          longitude: long,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  // console.log(currentLocation);

  useEffect(() => {
    // setAutoFocust(true);
    if (visible) {
      setInputFocusing(3);
      setLocationsDestination([]);
      setSearchKeyDestination('');
      setAddressSelectedDestination(null);
      Geolocation.getCurrentPosition(
        (position: any) => {
          if (position.coords) {
            // console.log(position.coords);
            reverseGeoCode({
              lat: position.coords.latitude,
              long: position.coords.longitude,
            });
          }
        },
        (error: any) => {
          console.log(error);
        },
        // {maximumAge: 0, timeout: 30000, enableHighAccuracy: true},
        {},
      );
    }
  }, [visible]);

  useEffect(() => {
    if (debouncedInputPickup && inputFocusing === 2 && !addressSelectedPickup) {
      handleSearchLocation(debouncedInputPickup);
    } else {
      setLocationsPickup([]); // Clear suggestions nếu input rỗng
    }
  }, [debouncedInputPickup, inputFocusing]);

  useEffect(() => {
    if (
      debouncedInputDestination &&
      inputFocusing === 3 &&
      !addressSelectedDestination
    ) {
      handleSearchLocation(debouncedInputDestination);
    } else {
      setLocationsDestination([]); // Clear suggestions nếu input rỗng
    }
  }, [debouncedInputDestination, inputFocusing]);

  return (
    <>
      <Modal animationType="slide" visible={visible} style={{flex: 1}}>
        <ContainerComponent
          backModal={handleClose}
          title="Which location do you want to find?">
          <SectionComponent styles={{marginTop: 5}}>
            <RowComponent justify="flex-end">
              <View style={{flex: 1}}>
                <InputComponent
                  numberOfLine={1}
                  styles={{
                    marginBottom: 0,
                    // minHeight: 50,
                    // paddingVertical: -5,

                    minHeight: 45,
                    backgroundColor: appColors.white2,
                  }}
                  affix={
                    <Image
                      source={require('../../assets/images/icons_ico_map_pin.png')}
                      style={{
                        width: 20,
                        height: 20,
                        resizeMode: 'cover',
                      }}
                    />
                  }
                  placeholder="Enter the pickup point"
                  // value={searchKeyPickup}
                  value={
                    searchKeyPickup?.length > 26
                      ? searchKeyPickup.substring(0, 26) + '...'
                      : searchKeyPickup
                  } // Giữ phần đầu
                  allowClear
                  autoFocus={inputFocusing === 2 ? true : false}
                  onChange={val => {
                    setSearchKeyPickup(val);
                    addressSelectedPickup && setAddressSelectedPickup(null);
                  }}
                  turnOffAutoFocus={() => {
                    // setAutoFocust(false);
                    setInputFocusing(2);
                  }}
                  // onEnd={handleSearchLocation}
                />
                <SpaceComponent height={8}></SpaceComponent>
                <InputComponent
                  styles={{
                    marginBottom: 0,
                    // minHeight: 50,
                    // paddingVertical: -5,
                    minHeight: 45,

                    backgroundColor: appColors.white2,
                  }}
                  numberOfLine={1}
                  affix={<Location size="20" color="#FF8A65" variant="Bold" />}
                  placeholder="Enter destination"
                  autoFocus={inputFocusing === 3 ? true : false}
                  // value={searchKeyDestination}
                  value={
                    searchKeyDestination?.length > 36
                      ? searchKeyDestination.substring(0, 26) + '...'
                      : searchKeyDestination
                  } // Giữ phần đầu
                  allowClear
                  onChange={val => {
                    setSearchKeyDestination(val);
                    addressSelectedDestination &&
                      setAddressSelectedDestination(null);
                  }}
                  turnOffAutoFocus={() => {
                    // autoFocus && setAutoFocust(false);
                    setInputFocusing(3);
                  }}
                  // onEnd={handleSearchLocation}
                />
              </View>
              <SpaceComponent width={10}></SpaceComponent>
              <CardComponent
                onPress={() => {}}
                styles={[
                  globalStyles.noSpaceCard,
                  {backgroundColor: appColors.gray3, width: 35, height: 35},
                ]}
                color="#ffffffB3">
                <Convertshape2 size="25" color={appColors.gray4} />
              </CardComponent>
            </RowComponent>
            <RowComponent
              justify="flex-end"
              styles={{
                marginTop: 10,
                // backgroundColor: 'black',
              }}>
              <ButtonComponent
                onPress={() => setIsVibleModalMapLocation(true)}
                text="Choose from map"
                icon={
                  <CardComponent
                    styles={[
                      globalStyles.noSpaceCard,
                      {width: 20, height: 20, flex: 0},
                    ]}
                    color="#ffffffB3">
                    <Map1
                      size="16"
                      color={appColors.primary}
                      variant="Outline"
                    />
                  </CardComponent>
                }
                type="link"
                textStyles={{
                  fontSize: 14,

                  flex: 0,
                  width: 130,
                }}
                textFont={fontFamilies.medium}></ButtonComponent>
            </RowComponent>
          </SectionComponent>
          <SpaceComponent
            height={8}
            styles={{backgroundColor: appColors.gray5}}></SpaceComponent>
          <SectionComponent>
            {isLoading ? (
              <View
                style={{
                  height: 500,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <ActivityIndicator />
              </View>
            ) : locationsPickup?.length > 0 ||
              locationsDestination?.length > 0 ? (
              <View style={{paddingTop: 15}}>
                <TextComponent
                  text="Most popular destination"
                  font={fontFamilies.semiBold}
                  styles={{marginBottom: 7}}
                  color={appColors.gray}></TextComponent>
                <FlatList
                  data={
                    inputFocusing === 2
                      ? locationsPickup
                      : inputFocusing === 3
                      ? locationsDestination
                      : []
                  }
                  showsVerticalScrollIndicator={false}
                  renderItem={({item, index}) => (
                    <View
                      style={{
                        borderBottomWidth: 0.8,
                        borderColor: appColors.gray3,
                        marginBottom: 5,
                        // backgroundColor: 'coral',
                      }}>
                      <ItemSuggestLocation
                        item={item}
                        key={`${item.place_id}${index}`}
                        onPress={() => {
                          inputFocusing === 2
                            ? setCheckSelectedPickup(item)
                            : setCheckSelectedDestination(item);
                          if (item.place_id) {
                            fetchCoordinatesFromPlaceId(item.place_id);
                          } else {
                            console.log('loi place id');
                          }
                          // onSelect(item);
                          // onClose();
                        }}></ItemSuggestLocation>
                    </View>
                  )}
                />
              </View>
            ) : (
              <View style={{paddingTop: 15, height: '100%'}}>
                <TextComponent
                  text="The location you need is not available."
                  font={fontFamilies.semiBold}
                  styles={{marginBottom: 7}}
                  color={appColors.gray}></TextComponent>
                {/* <FlatList
                style={{marginBottom: 100}}
                data={dataFake.locationsDataFake}
                showsVerticalScrollIndicator={false}
                renderItem={({item, index}) => (
                  <View
                    style={{
                      borderBottomWidth: 0.8,
                      borderColor: appColors.gray3,
                      marginBottom: 5,
                      // backgroundColor: 'coral',
                    }}>
                    <ItemSuggestLocation
                      item={item}
                      key={`${item.place_id}${index}`}
                      // setAddressSelected={val =>
                      //   setAddressSelected(val)
                      // }
                      onPress={() => {
                        onSelect(item);
                        onClose();
                      }}></ItemSuggestLocation>
                  </View>
                )}
              /> */}
              </View>
            )}
          </SectionComponent>

          <View
            style={{
              position: 'absolute',
              bottom: 10,
              left: 0,
              right: 0,
            }}>
            <ButtonComponent
              onPress={() => {
                setIsVibleModalConfirmRoute(true);
              }}
              styles={{paddingVertical: 12}}
              type="primary"
              // disable={!isScrollEnabled}
              color={
                addressSelectedDestination && addressSelectedPickup
                  ? appColors.BlueDarkTurquoise
                  : appColors.DarkSlateGrayBlue4
              }
              iconFlex="left"
              text={
                addressSelectedDestination && addressSelectedPickup
                  ? 'Confirm route'
                  : addressSelectedDestination && !addressSelectedPickup
                  ? 'Pick up location has not been selected'
                  : !addressSelectedDestination && addressSelectedPickup
                  ? 'Destination has not been selected'
                  : 'Let is determine the route'
              }></ButtonComponent>
          </View>
        </ContainerComponent>
      </Modal>
      <ModalMapLocation
        visible={isVibleModalMapLocation}
        onCloseMap={() => setIsVibleModalMapLocation(false)}
        dataLocationSelected={
          inputFocusing === 2 ? checkSelectedPickup : checkSelectedDestination
        }
        onSelect={val => {
          if (inputFocusing === 2) {
            setAddressSelectedPickup(val);
            setLocationsPickup([]);
            setCheckSelectedPickup(null);
            setSearchKeyPickup(val.main_name_place);
          } else {
            setAddressSelectedDestination(val);
            setLocationsDestination([]);
            setCheckSelectedDestination(null);
            setSearchKeyDestination(val.main_name_place);
          }
        }}></ModalMapLocation>

      {addressSelectedPickup && addressSelectedDestination && (
        <ModalMapConfirnRoute
          visible={isVibleModalConfirmRoute}
          addressSelectedPickup={addressSelectedPickup}
          addressSelectedDestination={addressSelectedDestination}
          onCloseMap={() =>
            setIsVibleModalConfirmRoute(false)
          }></ModalMapConfirnRoute>
      )}
    </>
  );
};

export default ModalLocationBooking;
