import {ArrowRight2, Location} from 'iconsax-react-native';
import React, {useEffect, useState} from 'react';
import {RowComponent, SpaceComponent, TextComponent} from '.';
import {appColors} from '../constants/appColors';
import {globalStyles} from '../styles/globalStyles';
import ModalLocationSave from '../modals/modalSelectLocation/ModalLocationSave';
import ModalMapLocation from '../modals/modalMap/ModalMapLocation';
import {StatusBar} from 'react-native';
import {LocationModelSuggest} from '../models/LocationModel';
import {useNavigation} from '@react-navigation/native';
// import {useIsFocused} from '@react-navigation/native';

interface Props {
  onSelect: (val: any) => void;
}

const ChoiceLocation = (props: Props) => {
  const navigation: any = useNavigation();
  const {onSelect} = props;

  const [isVibleModalLocation, setIsVibleModalLocation] = useState(false);
  const [isVibleModalMapLocation, setIsVibleModalMapLocation] = useState(false);
  const [addressSelected, setAddressSelected] =
    useState<LocationModelSuggest>();

  // const isFocused = useIsFocused();

  // useEffect(() => {
  //   if (isFocused) {
  //     console.log('abc');
  //     navigation.setOptions({
  //       onSelect: (val: LocationModelSuggest) => {
  //         setAddressSelected(val);
  //         onSelect(val);
  //       },
  //     });
  //   }
  // }, [isFocused, navigation]);

  return (
    <>
      <RowComponent
        onPress={() => setIsVibleModalLocation(!isVibleModalLocation)}
        // onPress={() => navigation.navigate('ScreenLocationSave')}
        styles={[
          globalStyles.inputContainer,
          {borderWidth: 1, borderColor: '#ccc'},
        ]}>
        <Location variant="Bold" size={22} color={`${appColors.primary}80`} />

        <SpaceComponent width={12} />

        <TextComponent
          numOfLine={1}
          text={
            addressSelected
              ? `${addressSelected.main_name_place} - ${addressSelected.description}`
              : 'Choice'
          }
          flex={1}
        />
        <ArrowRight2 color={appColors.primary} size={22} />
      </RowComponent>

      {isVibleModalLocation && (
        <ModalLocationSave
          visible={isVibleModalLocation}
          onClose={() => setIsVibleModalLocation(false)}
          openMap={() => setIsVibleModalMapLocation(true)}
          onSelect={val => {
            setAddressSelected(val);
            onSelect(val);
          }}
        />
      )}
      {/* {isVibleModalMapLocation && (
        <ModalMapLocation
          visible={isVibleModalMapLocation}
          onCloseMap={() => setIsVibleModalMapLocation(false)}
          onCloseAll={() => {
            setIsVibleModalMapLocation(false);
            setIsVibleModalLocation(false);
          }}
          onSelect={val => {
            setAddressSelected(val);
            onSelect(val);
          }}></ModalMapLocation>
      )} */}
      <ModalMapLocation
        visible={isVibleModalMapLocation}
        onCloseMap={() => setIsVibleModalMapLocation(false)}
        onCloseAll={() => {
          setIsVibleModalMapLocation(false);
          setIsVibleModalLocation(false);
        }}
        onSelect={val => {
          setAddressSelected(val);
          onSelect(val);
        }}></ModalMapLocation>
    </>
  );
};

export default ChoiceLocation;
