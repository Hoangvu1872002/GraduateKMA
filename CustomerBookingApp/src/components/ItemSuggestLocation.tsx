import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {LocationModelSuggest} from '../models/LocationModel';
import RowComponent from './RowComponent';
import CardComponent from './CardComponent';
import {globalStyles} from '../styles/globalStyles';
import {appColors} from '../constants/appColors';
import {Location} from 'iconsax-react-native';
import SpaceComponent from './SpaceComponent';
import TextComponent from './TextComponent';
import {fontFamilies} from '../constants/fontFamilies';

interface Props {
  item: LocationModelSuggest;
  numberLineTitle?: number;

  setAddressSelected?: (val: string) => void;
  setIsChangeCamera?: () => void;
  onPress?: () => void;
  setCenterCoordsCamera?: (val: {latitude: number; longitude: number}) => void;
}

const ItemSuggestLocation = (props: Props) => {
  const {
    item,
    setAddressSelected,
    numberLineTitle,
    setCenterCoordsCamera,
    // setIsChangeCamera,

    onPress,
  } = props;

  return (
    <TouchableOpacity
      style={{marginBottom: 12}}
      onPress={async () => {
        onPress && (await onPress());
        item.place_id &&
          setAddressSelected &&
          setAddressSelected(item.place_id);
        item.latitude &&
          item.longitude &&
          setCenterCoordsCamera &&
          setCenterCoordsCamera({
            latitude: item.latitude,
            longitude: item.longitude,
          });
        // setIsChangeCamera && setIsChangeCamera();
        // setSearchKey('');
      }}>
      <RowComponent styles={{flex: 1, marginTop: 10}}>
        <CardComponent
          styles={[
            globalStyles.noSpaceCard,
            {width: 25, height: 25, borderRadius: 100},
          ]}
          color={appColors.gray3}>
          <Location size="16" color={appColors.text2} variant="Outline" />
        </CardComponent>
        <SpaceComponent width={15}></SpaceComponent>
        <View style={{flex: 1}}>
          <TextComponent
            size={15}
            numOfLine={numberLineTitle}
            styles={{marginBottom: 5}}
            font={fontFamilies.medium}
            text={item.main_name_place}></TextComponent>

          {item.description && (
            <TextComponent
              numOfLine={numberLineTitle ? numberLineTitle : 2}
              size={11}
              text={item.description}
            />
          )}
        </View>
      </RowComponent>
    </TouchableOpacity>
  );
};

export default ItemSuggestLocation;
