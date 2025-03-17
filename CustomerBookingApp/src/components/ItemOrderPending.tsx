import {View, Text, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import RowComponent from './RowComponent';
import TextComponent from './TextComponent';
import SpaceComponent from './SpaceComponent';
import {fontFamilies} from '../constants/fontFamilies';
import {ArrowRight2, Component} from 'iconsax-react-native';
import {appColors} from '../constants/appColors';
import {apiGetBill} from '../apis';
import {useNavigation} from '@react-navigation/native';

interface Props {
  item: any;
}

const ItemOrderPending = (props: Props) => {
  const {item} = props;

  const navigation: any = useNavigation();

  const handleNavigatorScreenFollowDriver = async () => {
    console.log(item._id);

    const dataBill = await apiGetBill({billId: item._id});
    // console.log(dataBill);

    if (dataBill.data) {
      navigation.navigate('ScreenMapFollowDriver', {data: dataBill.data});
    }
  };

  return (
    <TouchableOpacity onPress={handleNavigatorScreenFollowDriver}>
      <RowComponent
        justify="space-between"
        styles={{
          // flex: 1,
          // paddingHorizontal: 5,
          backgroundColor: '#EEE5DE',
          marginBottom: 2,
          borderRadius: 10,
        }}>
        <RowComponent
          justify="flex-start"
          // styles={{flex: 1, backgroundColor: '#EEE0E5', marginBottom: 2}}
        >
          <View style={{paddingVertical: 5, paddingHorizontal: 10}}>
            <Image
              source={
                item.driverId.travelMode === 'Bike'
                  ? require('../assets/images/bike-white.png')
                  : require('../assets/images/car-white.png')
              } // ✅ Không dùng uri
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
              text={
                item.status === 'RECEIVED'
                  ? 'The driver is picking you up'
                  : 'The driver is arriving at his destination'
              }
              size={13}
              font={fontFamilies.medium}></TextComponent>
            <SpaceComponent height={5}></SpaceComponent>
            <RowComponent justify="flex-start">
              <TextComponent
                text={item.driverId.licensePlate}
                size={13}
                font={fontFamilies.medium}></TextComponent>
              <SpaceComponent width={5}></SpaceComponent>
              <Component size="8" color="black" variant="Bold" />
              <SpaceComponent width={5}></SpaceComponent>
              <TextComponent
                text={item.driverId.vehicleBrand}
                color={appColors.gray}
                size={11}
                font={fontFamilies.regular}></TextComponent>
            </RowComponent>
          </View>
        </RowComponent>
        <SpaceComponent width={10}></SpaceComponent>
        <View style={{marginRight: 10}}>
          <ArrowRight2 size="15" color={appColors.gray} variant="Outline" />
        </View>
      </RowComponent>
    </TouchableOpacity>
  );
};

export default ItemOrderPending;
