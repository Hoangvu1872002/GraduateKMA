import {View, Text, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {IBillTemporary} from '../../models/SelectModel';
import SectionComponent from './SectionComponent';
import RowComponent from './RowComponent';
import TextComponent from './TextComponent';
import {fontFamilies} from '../constants/fontFamilies';
import {appColors} from '../constants/appColors';
import {globalStyles} from '../styles/globalStyles';
import SpaceComponent from './SpaceComponent';
import {ArrowDown, Moneys} from 'iconsax-react-native';
import {useNavigation} from '@react-navigation/native';

interface Props {
  item: IBillTemporary;
}

const OrderItemComponent = (props: Props) => {
  const {item} = props;

  const navigation: any = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('DetailOrderScreen', {data: item})}
      style={[
        globalStyles.shadow,
        {
          marginTop: 15,
          height: 140,
          backgroundColor: appColors.WhiteSmoke,
          // backgroundColor: 'coral',
          maxWidth: '100%',
          padding: 15,
          borderRadius: 20,
          borderWidth: 0.5,
          borderColor: appColors.gray2,
        },
      ]}>
      <RowComponent
        justify="flex-start"
        styles={{
          borderBottomWidth: 0.5,
          borderBottomColor: appColors.gray4,
          paddingBottom: 3,
        }}>
        <SpaceComponent width={5}></SpaceComponent>
        <Image
          source={require('../assets/images/ic_pickup.png')}
          style={{
            width: 20,
            height: 20,
            resizeMode: 'cover',
          }}
        />
        <SpaceComponent width={15}></SpaceComponent>
        <TextComponent
          styles={{width: '90%'}}
          text={`${item.pickupAddress.main_name_place} ${
            item.pickupAddress.description ?? ''
          }`}
          numOfLine={1}
          font={fontFamilies.medium}
          size={13}></TextComponent>
      </RowComponent>
      <RowComponent styles={{marginVertical: 8}}>
        <TextComponent
          text={`${(item.distanceInKilometers * 0.001).toString()} km`}
          font={fontFamilies.medium}
          color={appColors.gray4}
          size={11}></TextComponent>
        <SpaceComponent width={5}></SpaceComponent>
        <ArrowDown
          size="22"
          variant="Broken"
          color={appColors.BlueDarkTurquoise}
        />
        <SpaceComponent width={5}></SpaceComponent>
        <TextComponent
          text={`${item.durationInMinutes.toString()} min`}
          font={fontFamilies.medium}
          color={appColors.gray4}
          size={11}></TextComponent>
      </RowComponent>
      <RowComponent
        justify="flex-start"
        styles={{
          borderBottomWidth: 0.5,
          borderBottomColor: appColors.gray4,
          paddingBottom: 3,
          // width: '70%',
        }}>
        <SpaceComponent width={5}></SpaceComponent>
        <Image
          source={require('../assets/images/ic_destination.png')}
          style={{
            width: 20,
            height: 20,
            resizeMode: 'cover',
          }}
        />
        <SpaceComponent width={15}></SpaceComponent>
        <TextComponent
          styles={{width: '90%'}}
          text={`${item.destinationAddress.main_name_place} ${
            item.destinationAddress.description ?? ''
          }`}
          font={fontFamilies.medium}
          numOfLine={1}
          size={13}></TextComponent>
      </RowComponent>
      <RowComponent
        styles={{alignItems: 'center', marginTop: 10}}
        justify="flex-end">
        <Moneys size="22" color="#33CC66" variant="Bold" />
        <SpaceComponent width={8}></SpaceComponent>
        <TextComponent
          font={fontFamilies.medium}
          size={13}
          text={`${item.cost.toString()}.000  vnd`}></TextComponent>
      </RowComponent>
    </TouchableOpacity>
  );
};

export default OrderItemComponent;
