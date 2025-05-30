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
import {useNavigation} from '@react-navigation/native';

interface Props {
  item: IBill;
}

const getStatusStyles = (status: string) => {
  switch (status) {
    case 'RECEIVED':
      return {backgroundColor: '#4CAF50', textColor: '#FFFFFF'}; // Màu nền xanh lá, chữ trắng
    case 'PENDING':
      return {backgroundColor: '#FFC107', textColor: '#000000'}; // Màu nền vàng, chữ đen
    case 'COMPLETED':
      return {backgroundColor: '#2196F3', textColor: '#FFFFFF'}; // Màu nền xanh dương, chữ trắng
    case 'CANCELED':
      return {backgroundColor: '#F44336', textColor: '#FFFFFF'}; // Màu nền đỏ, chữ trắng
    default:
      return {backgroundColor: 'coral', textColor: appColors.text2}; // Mặc định
  }
};

const HistoryItemComponent = (props: Props) => {
  const navigation: any = useNavigation();

  const {item} = props;

  const {backgroundColor, textColor} = getStatusStyles(item.status);

  return (
    <View
      style={{
        backgroundColor: appColors.white,
        borderRadius: 12, // Bo góc
        shadowColor: '#000', // Thêm bóng
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3, // Bóng trên Android
        marginVertical: 8, // Khoảng cách giữa các item
        paddingHorizontal: 0, // Thêm padding
        paddingTop: 10,
      }}>
      <SectionComponent>
        {/* Thời gian và trạng thái */}
        <RowComponent justify="space-between" styles={{marginBottom: 2}}>
          <TextComponent
            font={fontFamilies.medium}
            color={appColors.text2}
            size={12}
            text={moment(item.createdAt).format('HH:mm, DD/MM')}
          />
          <View
            style={{
              backgroundColor: backgroundColor,
              paddingVertical: 3,
              paddingHorizontal: 5,
              borderRadius: 5, // Bo góc trạng thái
            }}>
            <TextComponent
              font={fontFamilies.medium}
              color={textColor}
              size={10}
              text={item.status}
            />
          </View>
        </RowComponent>

        {/* Thông tin chuyến đi */}
        <RowComponent
          justify="space-between"
          styles={{
            paddingBottom: 2,
            borderBottomWidth: 0.8,
            borderColor: appColors.gray5,
          }}>
          <RowComponent justify="flex-start">
            <View style={{paddingVertical: 5}}>
              <Image
                source={
                  item.travelMode === 'Bike'
                    ? require('../assets/images/bike-white.png')
                    : require('../assets/images/car-white.png')
                }
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
            <SpaceComponent width={10} />
            <View>
              <RowComponent>
                <Box size="16" color="#1874CD" variant="Bold" />
                <SpaceComponent width={8} />
                <TextComponent
                  styles={{width: 200}}
                  text={`${item.pickupAddress.main_name_place} - ${item.pickupAddress.description}`}
                  numOfLine={1}
                  size={14}
                  font={fontFamilies.medium}
                />
              </RowComponent>
              <SpaceComponent height={5} />
              <RowComponent justify="flex-start">
                <Box size="16" color="coral" variant="Bold" />
                <SpaceComponent width={8} />
                <TextComponent
                  styles={{width: 200}}
                  text={`${item.destinationAddress.main_name_place} - ${item.destinationAddress.description}`}
                  numOfLine={1}
                  size={14}
                  font={fontFamilies.medium}
                />
              </RowComponent>
            </View>
          </RowComponent>
          <TextComponent
            text={`${item.cost.toFixed(2).toString()} $`}
            size={16}
            font={fontFamilies.bold} // Font đậm hơn cho giá tiền
            color="black" // Màu nổi bật
          />
        </RowComponent>

        {/* Nút hành động */}
        <RowComponent justify="flex-end" styles={{marginTop: 8}}>
          <ButtonComponent
            onPress={() =>
              navigation.navigate('DetailHistory', {_id: item._id})
            }
            width={80}
            textStyles={{fontSize: 14, color: 'white'}}
            type="primary"
            text="Detail"
            color={appColors.DarkSlateGrayBlue4}
            styles={{
              marginBottom: 0,
              width: 60,
              paddingHorizontal: 0,
              paddingVertical: 4,
              borderRadius: 6, // Bo góc nút
            }}
          />
          {/* <SpaceComponent width={8} /> */}
          {/* <ButtonComponent
            width={120}
            textStyles={{fontSize: 14, color: 'white'}}
            type="primary"
            color="#FFC125"
            text="Book again"
            styles={{
              width: 90,
              marginBottom: 0,
              paddingHorizontal: 0,
              paddingVertical: 4,
              borderRadius: 6, // Bo góc nút
            }}
          /> */}
        </RowComponent>
      </SectionComponent>
    </View>
  );
};

export default HistoryItemComponent;
