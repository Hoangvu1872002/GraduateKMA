import {
  View,
  Text,
  Linking,
  Image,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  ButtonComponent,
  CardComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '../../components';
import {fontFamilies} from '../../constants/fontFamilies';
import {appColors} from '../../constants/appColors';
import {globalStyles} from '../../styles/globalStyles';
import {
  ArrowDown2,
  ArrowLeft,
  ArrowRight2,
  Call,
  Location,
  MessageText1,
  Star1,
} from 'iconsax-react-native';
import {apiGetBill} from '../../apis';
import {IBill} from '../../models/BillModel';
import {useFocusEffect} from '@react-navigation/native';

const DetailHistory = ({navigation, route}: any) => {
  const {_id}: {_id: string} = route?.params || {};

  const [data, setData] = useState<IBill | null>(null);

  const fetchData = async () => {
    const dataBill = await apiGetBill({billId: _id});

    if (dataBill.data) {
      setData(dataBill.data);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [_id]),
  );

  const capitalizeWords = (str: string) =>
    str.replace(/\b\w/g, char => char.toUpperCase());

  return (
    <View style={{flex: 1, backgroundColor: appColors.white}}>
      <StatusBar barStyle={'light-content'} />
      <View style={[globalStyles.shadow, {height: 95, borderRadius: 20}]}>
        <View
          style={[
            globalStyles.shadow,
            {
              backgroundColor: appColors.primary,

              height: 85,
              width: '100%',
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
              justifyContent: 'center',

              alignItems: 'center',
              paddingTop:
                Platform.OS === 'android' ? StatusBar.currentHeight : 52,
            },
          ]}>
          <RowComponent justify="flex-start" styles={{flex: 1, marginLeft: 20}}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                width: 48,
                height: 48,
                justifyContent: 'center',
              }}>
              <ArrowLeft size={28} color={appColors.white} />
            </TouchableOpacity>
            <TextComponent
              flex={1}
              font={fontFamilies.semiBold}
              text={'Detail History'}
              title
              color={appColors.white}
            />
          </RowComponent>
        </View>
      </View>

      <View
        style={{
          height: 7,
          width: '100%',
          backgroundColor: appColors.WhiteSmoke,
          borderRadius: 100,
        }}></View>
      <SpaceComponent height={9}></SpaceComponent>
      <SectionComponent>
        <RowComponent justify="space-between">
          <View style={{flex: 1, display: 'flex', justifyContent: 'center'}}>
            <TextComponent
              text={
                data?.driverId
                  ? capitalizeWords(
                      `${data.driverId.lastname || ''} ${
                        data.driverId.firstname || ''
                      }`.trim(),
                    )
                  : 'No name'
              }
              size={18}
              font={fontFamilies.semiBold}></TextComponent>
            <SpaceComponent height={5}></SpaceComponent>
            <TextComponent
              size={13}
              text={data?.driverId.vehicleBrand.toUpperCase()}></TextComponent>
            <SpaceComponent height={5}></SpaceComponent>
            <View
              style={{
                alignSelf: 'flex-start',
                minWidth: 0,
              }}>
              <TextComponent
                styles={{
                  backgroundColor: appColors.gray2,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 8,
                  fontSize: 13,
                  minWidth: 0,
                  textAlign: 'center',
                }}
                text={data?.driverId.licensePlate}
              />
            </View>
          </View>
          <View>
            <Image
              source={{
                uri: 'https://static.vecteezy.com/system/resources/previews/024/183/502/original/male-avatar-portrait-of-a-young-man-with-a-beard-illustration-of-male-character-in-modern-color-style-vector.jpg',
              }}
              style={{
                width: 70,
                height: 70,
                resizeMode: 'cover',
              }}
            />
          </View>
        </RowComponent>
      </SectionComponent>
      <SpaceComponent height={5}></SpaceComponent>
      <View
        style={{
          height: 7,
          width: '100%',
          backgroundColor: appColors.WhiteSmoke,
          borderRadius: 100,
        }}></View>

      <SectionComponent styles={{paddingTop: 10}}>
        <RowComponent justify="space-between">
          <TextComponent
            text="Pay money"
            font={fontFamilies.medium}></TextComponent>
          <ArrowDown2 size="18" color={appColors.text} />
        </RowComponent>
        <SpaceComponent height={8}></SpaceComponent>
        <RowComponent justify="space-between">
          <TextComponent text="Cash payment"></TextComponent>
          <TextComponent
            font={fontFamilies.medium}
            size={13}
            text={`${data?.cost} $`}></TextComponent>
        </RowComponent>
      </SectionComponent>
      <View
        style={{
          height: 7,
          width: '100%',
          backgroundColor: appColors.WhiteSmoke,
          borderRadius: 100,
        }}></View>

      <SectionComponent
        styles={{
          borderBottomWidth: 0.5,
          borderBottomColor: appColors.gray2,
        }}>
        <SpaceComponent height={15}></SpaceComponent>
        <RowComponent justify="space-between">
          <TextComponent
            font={fontFamilies.medium}
            text={`Trip Code:  ${data?._id}`}></TextComponent>
          <TextComponent
            color={appColors.gray}
            size={12}
            text={`18/7/2002`}></TextComponent>
        </RowComponent>
        <SpaceComponent height={5}></SpaceComponent>

        <SpaceComponent height={10}></SpaceComponent>
        <SectionComponent
          styles={{
            paddingBottom: 15,
            backgroundColor: appColors.gray6,
            padding: 15,
            borderRadius: 12,
          }}>
          <RowComponent>
            <View
              style={{
                flex: 1,
                // backgroundColor: 'coral',
                justifyContent: 'center',
                alignItems: 'center',
                borderRightWidth: 0.5,
                borderRightColor: appColors.gray,
              }}>
              <TextComponent
                flex={0}
                font={fontFamilies.medium}
                text={`${data?.distanceInKilometers} km`}></TextComponent>
              <TextComponent
                flex={0}
                size={12}
                color={appColors.gray}
                // font={fontFamilies.medium}
                text="Distance"></TextComponent>
            </View>
            <View
              style={{
                flex: 1,
                // backgroundColor: 'green',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TextComponent
                flex={0}
                font={fontFamilies.medium}
                text={`${data?.durationInMinutes} minute`}></TextComponent>
              <TextComponent
                flex={0}
                size={12}
                color={appColors.gray}
                // font={fontFamilies.medium}
                text="Estimated time"></TextComponent>
            </View>
          </RowComponent>
        </SectionComponent>
        <SpaceComponent height={15}></SpaceComponent>
        <RowComponent justify="flex-start">
          <Image
            source={require('../../assets/images/icons_ico_map_pin.png')}
            style={{
              width: 15,
              height: 15,
              resizeMode: 'cover',
            }}
          />
          <SpaceComponent width={20}></SpaceComponent>
          <View
            style={{
              borderBottomWidth: 0.5,
              flex: 1,
              borderBottomColor: appColors.gray2,
            }}>
            <TextComponent
              numOfLine={1}
              font={fontFamilies.medium}
              text={data?.pickupAddress.main_name_place || ''}></TextComponent>
            <SpaceComponent height={4}></SpaceComponent>
            <TextComponent
              size={11}
              numOfLine={1}
              font={fontFamilies.regular}
              text={
                data?.pickupAddress.description || 'Not data for description'
              }></TextComponent>
            <SpaceComponent height={10}></SpaceComponent>
          </View>
        </RowComponent>
        <RowComponent justify="flex-start">
          <Location size="16" color="#FF8A65" variant="Bold" />
          <SpaceComponent width={20}></SpaceComponent>
          <View>
            <SpaceComponent height={10}></SpaceComponent>
            <TextComponent
              // styles={{maxWidth: '90%'}}
              // size={13}
              numOfLine={1}
              font={fontFamilies.medium}
              text={
                data?.destinationAddress.main_name_place || ''
              }></TextComponent>
            <SpaceComponent height={4}></SpaceComponent>
            <TextComponent
              // styles={{maxWidth: '90%'}}
              size={11}
              numOfLine={1}
              font={fontFamilies.regular}
              text={
                data?.destinationAddress.description ||
                'Not data for description'
              }></TextComponent>
          </View>
        </RowComponent>
      </SectionComponent>

      <SectionComponent>
        <SpaceComponent height={8}></SpaceComponent>
        <RowComponent
          // justify="space-around"
          styles={{
            width: '100%',
            height: 100,
          }}>
          <ButtonComponent
            width={118}
            onPress={() => {
              if (data) {
                navigation.push('ScreenLocationBooking', {item: data});
              }
            }}
            styles={{paddingVertical: 10}}
            color={appColors.primary}
            type="primary"
            textStyles={{flex: 0}}
            text="Book again"></ButtonComponent>
        </RowComponent>
      </SectionComponent>
    </View>
  );
};

export default DetailHistory;
