import {View, Text, Image} from 'react-native';
import React from 'react';
import RowComponent from './RowComponent';
import TextComponent from './TextComponent';
import SpaceComponent from './SpaceComponent';
import {fontFamilies} from '../constants/fontFamilies';
import {ArrowRight2, Component} from 'iconsax-react-native';
import {appColors} from '../constants/appColors';

interface Props {
  item: any;
}

const ItemOrderPending = (props: Props) => {
  const {item} = props;
  // console.log(item);

  return (
    <RowComponent
      justify="space-between"
      styles={{flex: 1, backgroundColor: '#EEE0E5', marginBottom: 2}}>
      <RowComponent
        justify="flex-start"
        // styles={{flex: 1, backgroundColor: '#EEE0E5', marginBottom: 2}}
      >
        <View style={{paddingVertical: 5, paddingHorizontal: 10}}>
          <Image
            source={require('../assets/images/bike.png')} // ✅ Không dùng uri
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              resizeMode: 'cover',
            }}
          />
        </View>
        <SpaceComponent width={10}></SpaceComponent>
        <View>
          <TextComponent
            text={`The driver is picking you up`}
            size={13}
            font={fontFamilies.medium}></TextComponent>
          <SpaceComponent height={5}></SpaceComponent>
          <RowComponent justify="flex-start">
            <TextComponent
              text={`18E1-002.12`}
              size={13}
              font={fontFamilies.medium}></TextComponent>
            <SpaceComponent width={5}></SpaceComponent>
            <Component size="8" color="black" variant="Bold" />
            <SpaceComponent width={5}></SpaceComponent>
            <TextComponent
              text={`Honda Wave Alpha`}
              color={appColors.gray}
              size={11}
              font={fontFamilies.regular}></TextComponent>
          </RowComponent>
        </View>
      </RowComponent>

      <View style={{marginRight: 10}}>
        <ArrowRight2 size="15" color={appColors.gray} variant="Outline" />
      </View>
    </RowComponent>
  );
};

export default ItemOrderPending;
