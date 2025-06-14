import {
  View,
  Text,
  StatusBar,
  Platform,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {IBill} from '../../models/BillModel';
import {appColors} from '../../constants/appColors';
import {globalStyles} from '../../styles/globalStyles';
import {
  ButtonComponent,
  CardComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '../../components';
import {
  ArrowDown2,
  ArrowLeft,
  Call,
  Location,
  MessageText1,
} from 'iconsax-react-native';
import {fontFamilies} from '../../constants/fontFamilies';
import {Image} from 'react-native';
import {apiGetUserById, apiUpdateBalenceDriver} from '../../apis';
import {useFocusEffect} from '@react-navigation/native';
import {IBillTemporary} from '../../models/SelectModel';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../stores/redux';
import {getCurrent} from '../../stores/users/asyncAction';

const ConfirmInfBill = ({navigation, route}: any) => {
  const {data}: {data: IBillTemporary} = route?.params || {};

  console.log(data);

  const dispatch = useDispatch<AppDispatch>();

  const [dataUser, setData] = useState<{
    lastname?: string;
    firstname?: string;
    mobile?: string;
  }>();

  const fetchData = async () => {
    const user = await apiGetUserById({_id: data.userId});

    if (user.data) {
      setData(user.data.rs);
    }
  };

  const handleUpdateBalance = async () => {
    try {
      const rs = await apiUpdateBalenceDriver({
        cost: parseFloat((data.cost * 0.3).toFixed(2)),
      });
      if (rs.data.success) {
        dispatch(getCurrent());
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while updating balance!');
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, []),
  );

  const capitalizeWords = (str: string) =>
    str.replace(/\b\w/g, char => char.toUpperCase());
  return (
    <View style={[globalStyles.container, {flex: 1}]}>
      <StatusBar barStyle={'light-content'} />
      <View style={[globalStyles.shadow, {height: 95, borderRadius: 20}]}>
        <View
          style={[
            globalStyles.shadow,
            {
              backgroundColor: appColors.primary,
              // height: Platform.OS === 'android' ? 168 : 182,
              // height: 182,
              height: 85,
              width: '100%',
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
              justifyContent: 'center',
              // borderWidth: 1,
              alignItems: 'center',
              paddingTop:
                Platform.OS === 'android' ? StatusBar.currentHeight : 52,
            },
          ]}>
          <TextComponent
            title
            text="Bill Information"
            font={fontFamilies.bold}
            color={appColors.WhiteSmoke}></TextComponent>
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
          <View style={{flex: 1, display: 'flex', alignItems: 'flex-start'}}>
            <TextComponent
              text={
                data?.userId
                  ? capitalizeWords(
                      `${dataUser?.lastname || ''} ${
                        dataUser?.firstname || ''
                      }`.trim(),
                    )
                  : 'No name'
              }
              size={18}
              font={fontFamilies.semiBold}></TextComponent>
            <SpaceComponent height={5}></SpaceComponent>
            <TextComponent text={dataUser?.mobile || ''}></TextComponent>
          </View>
          <RowComponent>
            <CardComponent
              onPress={() =>
                navigation.navigate('RoomMessageScreen', {
                  roomId: data.roomChatId,
                })
              }
              styles={[
                globalStyles.noSpaceCard,
                // globalStyles.shadow,
                {width: 38, height: 38, borderRadius: 12},
              ]}
              color={appColors.gray6}>
              <MessageText1 size="23" variant="Bold" color={appColors.gray} />
            </CardComponent>
            <SpaceComponent width={10}></SpaceComponent>

            <CardComponent
              onPress={() => {
                const phoneNumber = dataUser?.mobile; // Thay thế bằng số điện thoại của tài xế
                if (phoneNumber) {
                  Linking.openURL(`tel:${phoneNumber}`); // Mở ứng dụng gọi điện với số điện thoại
                } else {
                  console.error('Phone number is not available');
                }
              }}
              styles={[
                globalStyles.noSpaceCard,
                // globalStyles.shadow,
                {width: 38, height: 38, borderRadius: 12},
              ]}
              color={appColors.gray6}>
              <Call size="23" variant="Bold" color={appColors.gray} />
            </CardComponent>
            <SpaceComponent width={10}></SpaceComponent>
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
        </RowComponent>
      </SectionComponent>
      <View
        style={{
          height: 7,
          width: '100%',
          backgroundColor: appColors.WhiteSmoke,
          borderRadius: 100,
        }}></View>
      <SectionComponent styles={{paddingVertical: 10}}>
        <TextComponent
          text="Recipient information:"
          size={18}
          font={fontFamilies.semiBold}></TextComponent>
        <SpaceComponent height={10}></SpaceComponent>
        <RowComponent justify="space-between">
          <View style={{flex: 1, display: 'flex', alignItems: 'flex-start'}}>
            <TextComponent
              text={`Name: ${
                data?.infReceiver
                  ? capitalizeWords(`${data?.infReceiver.name}`.trim())
                  : 'No name'
              }`}
              size={14}
              font={fontFamilies.regular}></TextComponent>
            <SpaceComponent height={5}></SpaceComponent>
            <TextComponent
              text={`Mobile: ${
                data?.infReceiver?.mobile || ''
              }`}></TextComponent>
          </View>
          <RowComponent>
            <CardComponent
              onPress={() => {
                const phoneNumber = data?.infReceiver?.mobile; // Thay thế bằng số điện thoại của tài xế
                if (phoneNumber) {
                  Linking.openURL(`tel:${phoneNumber}`); // Mở ứng dụng gọi điện với số điện thoại
                } else {
                  console.error('Phone number is not available');
                }
              }}
              styles={[
                globalStyles.noSpaceCard,
                // globalStyles.shadow,
                {width: 38, height: 38, borderRadius: 12},
              ]}
              color={appColors.gray6}>
              <Call size="23" variant="Bold" color={appColors.gray} />
            </CardComponent>
          </RowComponent>
        </RowComponent>
      </SectionComponent>

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
            text={`${data?.cost.toFixed(2)} $`}></TextComponent>
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
              navigation.goBack();
              handleUpdateBalance();
            }}
            styles={{paddingVertical: 10}}
            color={appColors.primary}
            type="primary"
            textStyles={{flex: 0}}
            text="Confirm"></ButtonComponent>
        </RowComponent>
      </SectionComponent>
    </View>
  );
};

export default ConfirmInfBill;
