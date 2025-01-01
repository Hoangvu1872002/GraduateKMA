import GeoLocation from '@react-native-community/geolocation';
import axios from 'axios';
import {Location, Map, Map1, SearchNormal1} from 'iconsax-react-native';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
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
} from '../components';
import {appColors} from '../constants/appColors';
import {appInfo} from '../constants/appInfos';
import {LocationModelSuggest} from '../models/LocationModel';
import {globalStyles} from '../styles/globalStyles';
import useDebounce from '../hooks/useDebounce';
import {fontFamilies} from '../constants/fontFamilies';
import ItemSuggestLocation from '../components/ItemSuggestLocation';
import locationsDataFake from '../constants/data';
import {ScrollView} from 'react-native-gesture-handler';

// GeoCoder.init(process.env.MAP_API_KEY as string);

interface Props {
  visible: boolean;
  openMap: () => void;
  onClose: () => void;
  onSelect: (val: {
    address: string;
    postion?: {
      lat: number;
      long: number;
    };
  }) => void;
}

const ModalLocation = (props: Props) => {
  const {visible, onClose, onSelect, openMap} = props;
  const [searchKey, setSearchKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [locations, setLocations] = useState<LocationModelSuggest[]>([]);
  const [addressSelected, setAddressSelected] = useState('');

  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    long: number;
    addressName: string;
  }>();

  const debouncedInput = useDebounce(searchKey, 1500);

  useEffect(() => {
    console.log(addressSelected);
    if (addressSelected) {
      fetchCoordinatesFromPlaceId(addressSelected);
    }
  }, [addressSelected]);

  const handleClose = () => {
    onClose();
  };

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
        console.log(response.data);

        const dataSaveLocation = response.data.predictions.map((e: any) => ({
          description: e.structured_formatting.secondary_text,
          main_name_place: e.structured_formatting.main_text,
          place_id: e.place_id,
        }));
        setLocations(dataSaveLocation);
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
        setCurrentLocation({
          lat: lat,
          long: lng,
          addressName: response.data.result.formatted_address,
        });
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
    }
  };

  //   const handleGetAddressFromPosition = ({
  //     latitude,
  //     longitude,
  //   }: {
  //     latitude: number;
  //     longitude: number;
  //   }) => {
  //     onSelect({
  //       address: 'This is demo address',
  //       postion: {
  //         lat: latitude,
  //         long: longitude,
  //       },
  //     });
  //     onClose();
  //     GeoCoder.from(latitude, longitude)
  //       .then(data => {
  //         // console.log(data);
  //         // console.log(data.results[0].address_components[0]);
  //       })
  //       .catch(error => {
  //         console.log(error);
  //       });
  //   };

  // useEffect(() => {
  //   GeoLocation.getCurrentPosition(
  //     position => {
  //       if (position.coords) {
  //         setCurrentLocation({
  //           lat: position.coords.latitude,
  //           long: position.coords.longitude,
  //           addressName: '',
  //         });
  //       }
  //     },
  //     error => {
  //       console.log(error);
  //     },
  //     {},
  //   );
  // }, []);

  useEffect(() => {
    if (debouncedInput) {
      handleSearchLocation(debouncedInput);
    } else {
      setLocations([]); // Clear suggestions nếu input rỗng
    }
  }, [debouncedInput]);

  return (
    <Modal animationType="slide" visible={visible} style={{flex: 1}}>
      <ContainerComponent
        backModal={handleClose}
        title="Which location do you want to find?">
        <SectionComponent styles={{marginTop: 5}}>
          <RowComponent justify="flex-end">
            <View style={{flex: 1}}>
              <InputComponent
                styles={{
                  marginBottom: 0,
                  // minHeight: 50,
                  // paddingVertical: 15,
                  backgroundColor: appColors.gray5,
                }}
                affix={<Location size="20" color="#FF8A65" variant="Bold" />}
                placeholder="Search"
                value={searchKey}
                allowClear
                onChange={val => setSearchKey(val)}
                // onEnd={handleSearchLocation}
              />
            </View>
            <SpaceComponent width={12} />

            <CardComponent
              onPress={openMap}
              styles={[globalStyles.noSpaceCard]}
              color="#ffffffB3">
              <Map1 size="30" color={appColors.primary} variant="Outline" />
            </CardComponent>
          </RowComponent>
        </SectionComponent>
        <SpaceComponent
          height={8}
          styles={{backgroundColor: appColors.gray5}}></SpaceComponent>
        <SectionComponent>
          {isLoading ? (
            <ActivityIndicator />
          ) : locations.length > 0 ? (
            <View style={{paddingTop: 15}}>
              <TextComponent
                text="Most popular destination"
                font={fontFamilies.semiBold}
                styles={{marginBottom: 7}}
                color={appColors.gray}></TextComponent>
              <FlatList
                data={locations}
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
                    ></ItemSuggestLocation>
                  </View>
                )}
              />
            </View>
          ) : (
            <View style={{paddingTop: 15, height: '100%'}}>
              <TextComponent
                text="Most popular destination"
                font={fontFamilies.semiBold}
                styles={{marginBottom: 7}}
                color={appColors.gray}></TextComponent>
              <FlatList
                style={{marginBottom: 100}}
                data={locationsDataFake}
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
                    ></ItemSuggestLocation>
                  </View>
                )}
              />
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
          {/* <ButtonComponent
            styles={{marginBottom: 40}}
            text="Confirm"
            onPress={() => {
              onSelect({
                address: addressSelected,
                postion: currentLocation,
              });

              onClose();
            }}
            type="primary"
          /> */}
        </View>
      </ContainerComponent>
    </Modal>
  );
};

export default ModalLocation;
