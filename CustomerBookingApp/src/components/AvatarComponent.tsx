import React, {useEffect, useState} from 'react';
import {
  Image,
  ImageProps,
  ImageStyle,
  StyleProp,
  TouchableOpacity,
  View,
  ViewProps,
} from 'react-native';
import {TextComponent} from '.';
import {appColors} from '../constants/appColors';
import {fontFamilies} from '../constants/fontFamilies';
import {globalStyles} from '../styles/globalStyles';
// import userAPI from '../apis/userApi';

interface Props {
  avatar?: string;
  uid?: string;
  name?: string;
  size?: number;
  styles?: StyleProp<ImageStyle>;
  onPress?: () => void;
}

const AvatarComponent = (props: Props) => {
  const {avatar, name, size, styles, onPress, uid} = props;

  const [profile, setProfile] = useState<{name?: string; avatar?: string}>({
    name: name ?? '',
    avatar: avatar ?? '',
  });

  //   useEffect(() => {
  //     if (!avatar && uid) {
  //       getUserProfile();
  //     }
  //   }, [avatar, uid]);

  //   const getUserProfile = async () => {
  //     const api = `/get-profile?uid=${uid}`;
  //     try {
  //       const res: any = await userAPI.HandleUser(api);
  //       setProfile({
  //         name: res.data.name,
  //         avatar: res.data.avatar,
  //       });
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  return (
    <TouchableOpacity disabled={!onPress} onPress={onPress}>
      {avatar ? (
        <Image
          source={{uri: avatar}}
          style={[
            {
              width: size ?? 40,
              height: size ?? 40,
              borderRadius: 100,
              borderWidth: 1,
              borderColor: appColors.white,
            },
            styles,
          ]}
        />
      ) : (
        <View
          style={[
            globalStyles.center,
            {
              width: size ?? 40,
              height: size ?? 40,
              borderRadius: 100,
              borderWidth: 1,
              borderColor: appColors.white,
              backgroundColor: appColors.gray2,
            },
          ]}>
          <TextComponent
            text={
              profile.name
                ? profile.name.substring(0, 1).toLocaleUpperCase()
                : ''
            }
            font={fontFamilies.bold}
            color={appColors.white}
            size={size ? size / 3 : 14}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default AvatarComponent;
