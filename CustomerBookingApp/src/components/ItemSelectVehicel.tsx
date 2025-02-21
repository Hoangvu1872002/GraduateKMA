import {View, TouchableOpacity, Image} from 'react-native';
import React, {useState} from 'react';
import RowComponent from './RowComponent';
import CardComponent from './CardComponent';
import {globalStyles} from '../styles/globalStyles';
import {appColors} from '../constants/appColors';
import {Profile2User} from 'iconsax-react-native';
import SpaceComponent from './SpaceComponent';
import TextComponent from './TextComponent';
import {fontFamilies} from '../constants/fontFamilies';

interface Props {
  item?: any;
  numberLineTitle?: number;
  itemFocusing?: string;
  totalDistance: number;
  onPress?: (val: string) => void;
}

const ItemSelectVehicel = (props: Props) => {
  const {item, numberLineTitle, onPress, itemFocusing, totalDistance} = props;

  return (
    <TouchableOpacity
      style={{
        borderColor:
          item.id === itemFocusing
            ? appColors.BlueDarkTurquoise
            : appColors.WhiteSmoke, // Thay đổi màu viền khi focus
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderWidth: 1.5,
        borderRadius: 8,
      }}
      onPress={() => item?.id && onPress?.(item.id)}>
      <RowComponent styles={{flex: 1}}>
        <CardComponent
          styles={[
            globalStyles.noSpaceCard,
            {width: 43, height: 43, borderRadius: 10},
          ]}
          color={appColors.WhiteSmoke}>
          <Image
            source={item.image}
            style={{
              flex: 1,
              width: 45,
            }}
          />
        </CardComponent>
        <SpaceComponent width={15} />
        <RowComponent styles={{width: '84%'}} justify="space-between">
          <View>
            <TextComponent
              size={13}
              numOfLine={numberLineTitle}
              font={fontFamilies.semiBold}
              text={item.name}
            />
            <RowComponent justify="flex-start">
              <Profile2User size="12" color={appColors.text} />
              <SpaceComponent width={3} />
              <TextComponent
                numOfLine={numberLineTitle ?? 2}
                size={12}
                text={item.numberSeat}
              />
              <SpaceComponent width={3} />
              <TextComponent
                numOfLine={numberLineTitle ?? 2}
                size={12}
                text="->"
              />
              <SpaceComponent width={3} />
              <TextComponent
                numOfLine={numberLineTitle ?? 2}
                size={12}
                text={item.description}
              />
            </RowComponent>
          </View>
          <View>
            <TextComponent
              flex={0}
              font={fontFamilies.semiBold}
              size={13}
              text={`${Math.ceil(
                item.costCoefficient * totalDistance * 0.001,
              )}.000đ`}
            />
            <TextComponent
              flex={0}
              font={fontFamilies.medium}
              color={appColors.gray4}
              size={10}
              styles={{textDecorationLine: 'line-through'}}
              text={`${Math.ceil(
                item.costCoefficient * 1.5 * totalDistance * 0.001,
              )}.000đ`}
            />
          </View>
        </RowComponent>
      </RowComponent>
    </TouchableOpacity>
  );
};

export default ItemSelectVehicel;
