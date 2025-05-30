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
import {useDispatch} from 'react-redux';
import {setStateSelectVehicle} from '../stores/users/userSlide';
import {useNavigation} from '@react-navigation/native';

interface Props {
  data?: any;
  styles?: StyleProp<ViewStyle>;
}

const ItemBookingHome = (props: Props) => {
  const {data} = props;
  const dispatch = useDispatch();
  const navigation: any = useNavigation();

  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'coral',
      }}>
      <TouchableOpacity
        onPress={() => {
          dispatch(setStateSelectVehicle(data.type));
          navigation.navigate('ScreenLocationBooking');
        }}
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
