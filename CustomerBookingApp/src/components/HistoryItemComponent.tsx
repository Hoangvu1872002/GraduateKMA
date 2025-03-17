import {View, Text, Image} from 'react-native';
import React from 'react';
import {IBill} from '../models/BillModel';
import {appColors} from '../constants/appColors';
import moment from 'moment';
import SectionComponent from './SectionComponent';
import RowComponent from './RowComponent';
import TextComponent from './TextComponent';
import {fontFamilies} from '../constants/fontFamilies';
import SpaceComponent from './SpaceComponent';
import {ArrowRight2, Box} from 'iconsax-react-native';
import ButtonComponent from './ButtonComponent';

interface Props {
  item: IBill;
}

const HistoryItemComponent = (props: Props) => {
  const {item} = props;

  return (
    <View
      style={{
        backgroundColor: appColors.white,
        height: 130,
        width: '100%',
        marginVertical: 5,
        paddingVertical: 10,
      }}>
      <SectionComponent>
        <RowComponent justify="space-between">
          <TextComponent
            font={fontFamilies.medium}
            color={appColors.text2}
            size={12}
            text={moment(item.createdAt).format(
              'HH:mm, DD/MM',
            )}></TextComponent>
          <View
            style={{
              backgroundColor: 'coral',
              paddingVertical: 3,
              paddingHorizontal: 8,
            }}>
            <TextComponent
              font={fontFamilies.medium}
              color={appColors.text2}
              size={12}
              text={item.status}></TextComponent>
          </View>
        </RowComponent>
        <RowComponent justify="space-between">
          <RowComponent
            justify="flex-start"
            // styles={{flex: 1, backgroundColor: '#EEE0E5', marginBottom: 2}}
          >
            <View style={{paddingVertical: 5}}>
              <Image
                source={
                  item.travelMode === 'Bike'
                    ? require('../assets/images/bike-white.png')
                    : require('../assets/images/car-white.png')
                } // ✅ Không dùng uri
                style={{
                  width: 50,
                  height: 50,
                  backgroundColor: '#FFDAB9',
                  padding: 10,
                  borderRadius: 12,
                  resizeMode: 'contain',
                }}
              />
            </View>
            <SpaceComponent width={10}></SpaceComponent>
            <View>
              <RowComponent>
                <Box size="16" color="#1874CD" variant="Bold" />
                <SpaceComponent width={8}></SpaceComponent>
                <TextComponent
                  text={item.pickupAddress.main_name_place}
                  size={14}
                  font={fontFamilies.medium}></TextComponent>
              </RowComponent>
              <SpaceComponent height={5}></SpaceComponent>
              <RowComponent justify="flex-start">
                <Box size="16" color="coral" variant="Bold" />
                <SpaceComponent width={8}></SpaceComponent>
                <TextComponent
                  text={item.destinationAddress.main_name_place}
                  size={14}
                  font={fontFamilies.medium}></TextComponent>
                <SpaceComponent width={5}></SpaceComponent>
              </RowComponent>
            </View>
          </RowComponent>
          <TextComponent
            text={`${item.cost.toString()}.000đ`}
            size={14}
            font={fontFamilies.medium}></TextComponent>
        </RowComponent>
        <RowComponent justify="flex-end" styles={{marginTop: 2}}>
          <ButtonComponent
            width={60}
            textStyles={{fontSize: 14, color: appColors.text}}
            type="primary"
            text="Detail"
            color={appColors.DarkSlateGrayBlue4}
            styles={{
              paddingHorizontal: 0,
              paddingVertical: 5,
            }}></ButtonComponent>

          <SpaceComponent width={5}></SpaceComponent>

          <ButtonComponent
            width={100}
            textStyles={{fontSize: 14, color: appColors.text}}
            type="primary"
            color="#FFC125"
            text="Book again"
            styles={{
              paddingHorizontal: 0,
              paddingVertical: 5,
            }}></ButtonComponent>
        </RowComponent>
      </SectionComponent>
    </View>
  );
};

export default HistoryItemComponent;
