import {Bookmark, Bookmark2, Location} from 'iconsax-react-native';
import React from 'react';
import {
  AvatarGroup,
  CardComponent,
  RowComponent,
  SpaceComponent,
  TextComponent,
} from '.';
import {appColors} from '../constants/appColors';
import {appInfo} from '../constants/appInfos';
import {EventModel} from '../models/EventModel';
import {Image, ImageBackground, View} from 'react-native';
import {fontFamilies} from '../constants/fontFamilies';
import {globalStyles} from '../styles/globalStyles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {DateTime} from '../utils/DateTime';

interface Props {
  // item: EventModel;
  item: any;
  type: 'card' | 'list';
}

const EventItem = (props: Props) => {
  const {item, type} = props;
  // console.log(item);

  const navigation: any = useNavigation();

  return (
    <CardComponent
      isShadow
      styles={{width: appInfo.sizes.WIDTH * 0.7}}
      onPress={() => navigation.navigate('EventDetail', {item})}>
      {type === 'card' ? (
        <>
          <ImageBackground
            style={{flex: 1, marginBottom: 12, height: 131, padding: 10}}
            source={require('../assets/images/event-image.png')}
            imageStyle={{
              resizeMode: 'cover',
              borderRadius: 12,
            }}>
            <RowComponent justify="space-between">
              <CardComponent
                styles={[globalStyles.noSpaceCard]}
                color="#ffffffB3">
                <TextComponent
                  color={appColors.danger2}
                  font={fontFamilies.bold}
                  size={18}
                  text="10"
                />
                <TextComponent
                  color={appColors.danger2}
                  font={fontFamilies.semiBold}
                  size={10}
                  text="JUNE"
                />
              </CardComponent>
              <CardComponent
                styles={[globalStyles.noSpaceCard]}
                color="#ffffffB3">
                <MaterialIcons
                  name="bookmark"
                  color={appColors.danger2}
                  size={22}
                />
              </CardComponent>
            </RowComponent>
          </ImageBackground>
          <TextComponent numOfLine={1} text={item.title} title size={18} />
          <AvatarGroup />
          <RowComponent>
            <Location size={18} color={appColors.text3} variant="Bold" />
            <SpaceComponent width={8} />
            <TextComponent
              flex={1}
              numOfLine={1}
              // text={item.locationAddress}
              text={item.location.address}
              size={12}
              color={appColors.text2}
            />
          </RowComponent>
        </>
      ) : (
        <>
          <RowComponent>
            <Image
              source={{uri: item.photoUrl}}
              style={{
                width: 79,
                height: 92,
                borderRadius: 12,
                resizeMode: 'cover',
              }}
            />
            <SpaceComponent width={12} />
            <View
              style={{
                flex: 1,
                justifyContent: 'space-between',
                height: '100%',
              }}>
              <TextComponent
                color={appColors.primary}
                text={`${DateTime.GetDayString(item.date)} • ${DateTime.GetTime(
                  new Date(item.startAt),
                )}`}
              />
              <TextComponent text={item.title} title size={19} numOfLine={2} />
              <RowComponent>
                <Location size={18} color={appColors.text3} variant="Bold" />
                <SpaceComponent width={8} />
                <TextComponent
                  flex={1}
                  numOfLine={1}
                  text={item.location.address}
                  size={12}
                  color={appColors.text2}
                />
              </RowComponent>
            </View>
          </RowComponent>
        </>
      )}
    </CardComponent>
  );
};

export default EventItem;
