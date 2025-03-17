import {Bookmark, Bookmark2, Location, TimerStart} from 'iconsax-react-native';
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
import {Image, ImageBackground, TouchableOpacity, View} from 'react-native';
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
  console.log(item);

  const navigation: any = useNavigation();

  return (
    <View>
      {type === 'card' ? (
        <TouchableOpacity
          style={{
            width: appInfo.sizes.WIDTH * 0.7,
            marginHorizontal: 5,
            // overflow: 'hidden',
          }}
          onPress={() => navigation.navigate('EventDetail', {item})}>
          <View
            style={{
              flex: 1,
              marginBottom: 1,
              height: 110,
              padding: 10,
              // backgroundColor: 'coral',
              backgroundColor: '#EEE5DE',
              borderRadius: 12,
            }}
            // source={require('../assets/images/event-image.png')}
            // imageStyle={{
            //   resizeMode: 'cover',
            //   borderRadius: 12,
            // }}
          >
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
              <SpaceComponent width={10}></SpaceComponent>
              <View>
                <TextComponent
                  numOfLine={1}
                  text={item.title}
                  styles={{width: '85%'}}
                  title
                  size={15}
                />
                <RowComponent>
                  <Location
                    size={18}
                    color={appColors.danger2}
                    variant="Bold"
                  />
                  <SpaceComponent width={8} />
                  <TextComponent
                    flex={1}
                    numOfLine={1}
                    title
                    // text={item.locationAddress}
                    text={item.location.address}
                    size={12}
                    color={appColors.text2}
                  />
                </RowComponent>
              </View>
            </RowComponent>
            <SpaceComponent height={6}></SpaceComponent>
            <TextComponent
              color={appColors.text2}
              numOfLine={2}
              text={item.description}
              // title
              size={11}
            />
            <SpaceComponent height={2}></SpaceComponent>
            <RowComponent justify="flex-end">
              <TimerStart size="14" color="#FF8A65" />
              <SpaceComponent width={5}></SpaceComponent>
              <TextComponent
                // numOfLine={1}
                title
                // text={item.locationAddress}
                size={12}
                color={appColors.text2}
                text="18/07/2025"></TextComponent>
            </RowComponent>
          </View>
        </TouchableOpacity>
      ) : (
        <CardComponent
          styles={{width: appInfo.sizes.WIDTH * 0.7}}
          onPress={() => navigation.navigate('EventDetail', {item})}>
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
        </CardComponent>
      )}
    </View>
  );
};

export default EventItem;
