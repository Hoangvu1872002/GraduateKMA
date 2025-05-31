import {
  View,
  Text,
  StatusBar,
  Platform,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {IBill} from '../../models/BillModel';
import {appColors} from '../../constants/appColors';
import {globalStyles} from '../../styles/globalStyles';
import {
  ButtonComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '../../components';
import {ArrowDown2, ArrowLeft, Location} from 'iconsax-react-native';
import {fontFamilies} from '../../constants/fontFamilies';
import {Image} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useStripe} from '@stripe/stripe-react-native';

const ConfirmInfBill = ({navigation, route}: any) => {
  const {data}: {data: any} = route?.params || {};

  const stripe = useStripe();
  const [alertVisible, setAlertVisible] = useState(false);
  const [done, setDone] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const showCustomAlert = (message: string, done?: boolean) => {
    setAlertMessage(message);
    setAlertVisible(true);
    setDone(done || false);
  };

  const subscribe = async () => {
    try {
      // sending request
      const response = await fetch('http://192.168.1.39:5002/stripe/pay', {
        method: 'POST',
        body: JSON.stringify({cost: data.cost.toFixed(2)}),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const datars = await response.json();
      if (!response.ok) return showCustomAlert(datars.message);
      const clientSecret = datars.clientSecret;
      const initSheet = await stripe.initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: 'Driver Booking App',
      });

      if (initSheet.error) return showCustomAlert(initSheet.error.message);

      const presentSheet = await stripe.presentPaymentSheet();
      if (presentSheet.error)
        return showCustomAlert(presentSheet.error.message);

      showCustomAlert('Payment complete, thank you!');
    } catch (err) {
      console.error(err);
      Alert.alert('Something went wrong, try again later!');
    }
  };

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
                      `${data?.driverId?.lastname || ''} ${
                        data?.driverId?.firstname || ''
                      }`.trim(),
                    )
                  : 'No name'
              }
              size={18}
              font={fontFamilies.semiBold}></TextComponent>
            <SpaceComponent height={5}></SpaceComponent>
            <TextComponent text={data?.driverId?.mobile || ''}></TextComponent>
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
            width={150}
            onPress={subscribe}
            styles={{paddingVertical: 10}}
            color={appColors.primary}
            type="primary"
            textStyles={{flex: 0}}
            text="Payment now"></ButtonComponent>
        </RowComponent>
      </SectionComponent>

      <Modal
        visible={alertVisible}
        transparent={true}
        animationType="fade"
        statusBarTranslucent={true}
        onRequestClose={() => setAlertVisible(false)}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <View
            style={{
              width: '80%',
              backgroundColor: '#FFF',
              borderRadius: 16,
              padding: 25,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 4},
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}>
            <TextComponent
              font={fontFamilies.medium}
              size={18}
              text={alertMessage}
              color={done ? appColors.primary : appColors.danger}
              styles={{textAlign: 'center', marginBottom: 16}}
            />
            <SpaceComponent height={20} />
            <ButtonComponent
              onPress={() => {
                setAlertVisible(false);
                done && navigation.navigate('HomeScreen');
              }}
              width={done ? 150 : 80}
              styles={{paddingVertical: 10, marginBottom: 0}}
              color={appColors.primary}
              type="primary"
              textStyles={{flex: 0, fontSize: 16}}
              text={!done ? 'Close' : 'Go Home'}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ConfirmInfBill;
