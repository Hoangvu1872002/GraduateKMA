import {
  View,
  Text,
  StatusBar,
  Platform,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import {globalStyles} from '../../styles/globalStyles';
import {appColors} from '../../constants/appColors';
import {
  ButtonComponent,
  InputComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '../../components';
import {ArrowLeft, Location} from 'iconsax-react-native';
import {fontFamilies} from '../../constants/fontFamilies';
import {LocationModelSuggest} from '../../models/LocationModel';

const RecipientInfScreen = ({navigation, route}: any) => {
  const {
    addressSelectedPickup,
    addressSelectedDestination,
  }: {
    addressSelectedPickup: LocationModelSuggest;
    addressSelectedDestination: LocationModelSuggest;
  } = route?.params;

  const initValues = {
    name: '',
    mobile: '',
  };

  const [infReceiver, setInfReceiver] = useState<any>(initValues);

  const handleChangeValue = (key: string, value: string) => {
    const items = {...infReceiver};
    items[`${key}`] = value;

    setInfReceiver(items);
  };

  const handleAddEvent = () => {
    navigation.navigate('ModalMapConfirnRoute', {
      addressSelectedPickup,
      addressSelectedDestination,
      infReceiver,
    });
  };

  return (
    <View
      style={[
        globalStyles.container,
        {flex: 1, backgroundColor: appColors.gray6},
      ]}>
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
              text={'Recipient information'}
              title
              color={appColors.white}
            />
          </RowComponent>
        </View>
      </View>
      <SectionComponent
        styles={{
          marginTop: 20,
          borderBottomWidth: 0.5,
          borderBottomColor: appColors.gray2,
        }}>
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
              size={15}
              font={fontFamilies.medium}
              text={
                addressSelectedPickup.main_name_place || ''
              }></TextComponent>
            <SpaceComponent height={4}></SpaceComponent>
            <TextComponent
              size={12}
              numOfLine={1}
              font={fontFamilies.regular}
              text={
                addressSelectedPickup.description || 'Not data for description'
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
              size={15}
              numOfLine={1}
              font={fontFamilies.medium}
              text={
                addressSelectedDestination.main_name_place || ''
              }></TextComponent>
            <SpaceComponent height={4}></SpaceComponent>
            <TextComponent
              // styles={{maxWidth: '90%'}}
              size={12}
              numOfLine={1}
              font={fontFamilies.regular}
              text={
                addressSelectedDestination.description ||
                'Not data for description'
              }></TextComponent>
          </View>
        </RowComponent>
      </SectionComponent>

      <SectionComponent styles={{marginTop: 30}}>
        <TextComponent
          text="Enter recipient information:"
          title></TextComponent>
        <SpaceComponent height={20}></SpaceComponent>
        <InputComponent
          placeholder="Name"
          value={infReceiver.name}
          allowClear
          // onChange={() => {}}
          onChange={val => handleChangeValue('name', val)}
        />
        <InputComponent
          placeholder="Mobile"
          allowClear
          type="number-pad"
          value={infReceiver.mobile}
          // onChange={() => {}}
          onChange={val => handleChangeValue('mobile', val)}
        />
      </SectionComponent>
      <SectionComponent styles={{marginTop: 20}}>
        <ButtonComponent
          width={150}
          disable={infReceiver.name === '' || infReceiver.mobile === ''}
          text="Confirm"
          onPress={handleAddEvent}
          type="primary"
        />
      </SectionComponent>
    </View>
  );
};

export default RecipientInfScreen;
