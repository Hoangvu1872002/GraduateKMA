import {
  View,
  Text,
  StyleProp,
  ViewStyle,
  Image,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {appColors} from '../constants/appColors';
import TextComponent from './TextComponent';
import {fontFamilies} from '../constants/fontFamilies';
import {globalStyles} from '../styles/globalStyles';

interface Props {
  data?: any;
  styles?: StyleProp<ViewStyle>;
}

const ItemBookingHome = (props: Props) => {
  const {data} = props;

  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'coral',
      }}>
      <TouchableOpacity
        style={[
          globalStyles.shadow,
          {
            backgroundColor: appColors.gray3,
            height: 60,
            width: 80,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 5,
          },
        ]}>
        <Image
          source={data.image}
          style={{
            // backgroundColor: 'coral',
            flex: 1,
            width: 65,
            resizeMode: 'contain',
          }}
        />
      </TouchableOpacity>
      <View>
        <TextComponent
          text={data.title}
          size={11}
          font={fontFamilies.semiBold}></TextComponent>
      </View>
    </View>
  );
};

export default ItemBookingHome;
