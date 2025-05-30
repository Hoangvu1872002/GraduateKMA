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
import moment from 'moment';
import {apiDeleteEvent} from '../apis';
import Toast from 'react-native-toast-message';

interface Props {
  // item: EventModel;
  item: EventModel;
  fetchDataEvent: () => void;
  type: 'card' | 'list';
}

const EventItem = (props: Props) => {
  const {item, type, fetchDataEvent} = props;

  // console.log(item.main_name_place);

  const handleDeleteEvent = async () => {
    const response = await apiDeleteEvent({eventId: item._id});
    if (response.data.success) {
      fetchDataEvent();
      Toast.show({
        type: 'success',
        text1: 'Success!',
        autoHide: true,
        text2: 'Delete event success',
        visibilityTime: 2000,
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error!',
        autoHide: true,
        text2: 'Error!',
        visibilityTime: 3000,
      });
    }
  };

  const navigation: any = useNavigation();

  return (
    <View>
      {type === 'card' ? (
        <TouchableOpacity
          style={{
            width: appInfo.sizes.WIDTH * 0.65,
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
            <RowComponent justify="flex-start">
              <CardComponent
                styles={[globalStyles.noSpaceCard, {width: 60}]}
                color="#ffffffB3">
                <TextComponent
                  color={appColors.danger2}
                  font={fontFamilies.bold}
                  size={18}
                  text={moment(item.dateEnd).format('DD')}
                />
                <TextComponent
                  color={appColors.danger2}
                  font={fontFamilies.semiBold}
                  size={10}
                  text={moment(item.dateEnd).format('MMMM')}
                />
              </CardComponent>
              <SpaceComponent width={10}></SpaceComponent>
              <View>
                <TextComponent
                  numOfLine={1}
                  text={item.title}
                  styles={{width: 200}}
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
                    // styles={{width: 80}}
                    flex={1}
                    numOfLine={1}
                    title
                    // text={item.locationAddress}
                    text={item.main_name_place}
                    size={12}
                    color={appColors.text}
                  />
                </RowComponent>
              </View>
            </RowComponent>
            <SpaceComponent height={6}></SpaceComponent>

            <TextComponent
              color={appColors.text2}
              numOfLine={2}
              text={item.description}
              styles={{height: 30}}
              // title
              size={11}
            />
            {/* <SpaceComponent height={2}></SpaceComponent> */}
            <RowComponent justify="flex-end">
              <TimerStart size="14" color="#FF8A65" />
              <SpaceComponent width={5}></SpaceComponent>
              <TextComponent
                // numOfLine={1}
                title
                // text={item.locationAddress}
                size={12}
                color={appColors.text2}
                text={moment(item.createdAt).format(
                  'mm:HH - DD/MM/YYYY',
                )}></TextComponent>
            </RowComponent>
          </View>
        </TouchableOpacity>
      ) : (
        <View
          style={{
            width: appInfo.sizes.WIDTH * 0.92,
            marginHorizontal: appInfo.sizes.WIDTH * 0.04,
            minHeight: 120,
            marginBottom: 18,
            borderRadius: 16,
            backgroundColor: '#fff',
            shadowColor: '#000',
            shadowOpacity: 0.07,
            shadowRadius: 8,
            elevation: 3,
            borderWidth: 1,
            borderColor: '#EEE5DE',
          }}
          // activeOpacity={0.85}
        >
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              padding: 14,
              borderRadius: 16,
              backgroundColor: 'white',
              position: 'relative',
            }}>
            {/* Nút góc trên bên phải */}
            <View
              style={{
                position: 'absolute',
                top: 10,
                right: 14,
                flexDirection: 'row',
                gap: 1,
                zIndex: 2,
              }}>
              <TouchableOpacity
                style={{
                  padding: 6,
                  backgroundColor: appColors.text3,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: '#EEE5DE',
                  marginRight: 6,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => navigation.navigate('EventDetail', {item})}>
                <MaterialIcons
                  name="visibility"
                  size={20}
                  color={appColors.primary}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  padding: 6,
                  backgroundColor: appColors.text3,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: '#EEE5DE',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => {
                  handleDeleteEvent();
                }}>
                <MaterialIcons
                  name="delete"
                  size={20}
                  color={appColors.danger2}
                />
              </TouchableOpacity>
            </View>
            <CardComponent
              styles={[
                globalStyles.noSpaceCard,
                {
                  width: 60,
                  height: 60,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 14,
                  backgroundColor: '#fff',
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: appColors.text3,
                  shadowColor: '#000',
                  shadowOpacity: 0.05,
                  shadowRadius: 4,
                  elevation: 0,
                },
              ]}
              color="#fff">
              <TextComponent
                color={appColors.danger2}
                font={fontFamilies.bold}
                size={20}
                text={moment(item.dateEnd).format('DD')}
              />
              <TextComponent
                color={appColors.danger2}
                font={fontFamilies.semiBold}
                size={11}
                text={moment(item.dateEnd).format('MMM')}
              />
            </CardComponent>
            <View style={{flex: 1, justifyContent: 'center'}}>
              <TextComponent
                numOfLine={1}
                text={item.title}
                styles={{marginBottom: 2, maxWidth: 190}}
                title
                size={16}
              />
              <RowComponent>
                <Location size={16} color={appColors.danger2} variant="Bold" />
                <SpaceComponent width={6} />
                <TextComponent
                  flex={1}
                  numOfLine={1}
                  title
                  text={item.main_name_place}
                  size={13}
                  color={appColors.text}
                />
              </RowComponent>
              <TextComponent
                color={appColors.text2}
                numOfLine={2}
                text={item.description}
                styles={{marginTop: 6, marginBottom: 4}}
                size={11}
              />
              <RowComponent justify="flex-end">
                <TimerStart size="14" color="#FF8A65" />
                <SpaceComponent width={5} />
                <TextComponent
                  size={12}
                  color={appColors.text2}
                  text={moment(item.createdAt).format('HH:mm - DD/MM/YYYY')}
                />
              </RowComponent>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default EventItem;
