import {Image, Platform, StatusBar, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  ButtonComponent,
  ButtonImagePicker,
  ChoiceLocation,
  ContainerComponent,
  DateTimePicker,
  DropdownPicker,
  InputComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '../../components';
import {useSelector} from 'react-redux';
// import {authSelector} from '../redux/reducers/authReducer';
// import userAPI from '../apis/userApi';
import {SelectModel} from '../../models/SelectModel';
import {ImageOrVideo} from 'react-native-image-crop-picker';
import {Validate} from '../../utils/validate';
import {appColors} from '../../constants/appColors';
// import storage from '@react-native-firebase/storage';
import {EventModel} from '../../models/EventModel';
import {RootState} from '../../stores/redux';
import {apiCreateEvent, apiGetAllUsers} from '../../apis';
import {globalStyles} from '../../styles/globalStyles';
import {fontFamilies} from '../../constants/fontFamilies';
import Toast from 'react-native-toast-message';
import {LocationModelSuggest} from '../../models/LocationModel';
import {ArrowLeft} from 'iconsax-react-native';
// import eventAPI from '../apis/eventApi';

const initValues = {
  title: '',
  description: '',
  locationTitle: '',
  locationAddress: '',
  position: {
    lat: '',
    long: '',
  },
  // avatar: '',
  // users: [],
  authorId: '',
  // startAt: Date.now(),
  endAt: Date.now(),
  date: Date.now(),
  // price: '',
  // category: '',
};

const AddNewScreen = ({navigation}: any) => {
  // const auth = useSelector(authSelector);

  const {current} = useSelector((state: RootState) => state.user);
  // console.log(current);

  const [eventData, setEventData] = useState<any>({
    ...initValues,
    authorId: current._id,
  });
  // const [usersSelects, setUsersSelects] = useState<SelectModel[]>([]);
  // const [fileSelected, setFileSelected] = useState<any>();
  const [errorsMess, setErrorsMess] = useState<string[]>([]);
  const [addressSelected, setAddressSelected] =
    useState<LocationModelSuggest | null>(null);

  // useEffect(() => {
  //   handleGetAllUsers();
  // }, []);

  useEffect(() => {
    const mess = Validate.EventValidation(eventData);

    setErrorsMess(mess);
  }, [eventData]);

  const handleChangeValue = (
    key: string,
    value: string | Date | string[] | number,
  ) => {
    const items = {...eventData};
    items[`${key}`] = value;

    setEventData(items);
  };

  // const handleGetAllUsers = async () => {
  //   try {
  //     const res: any = await apiGetAllUsers();

  //     if (res && res.data && res.data.rs) {
  //       const items: SelectModel[] = [];

  //       res.data.rs.forEach(
  //         (item: any) =>
  //           item.email &&
  //           items.push({
  //             label: item.email,
  //             value: item._id,
  //           }),
  //       );

  //       setUsersSelects(items);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const handleAddEvent = async () => {
    const rs = await apiCreateEvent(eventData);

    if (rs.data.success) {
      setEventData({
        ...initValues,
        authorId: current._id,
      });

      setAddressSelected(null);

      Toast.show({
        type: 'success',
        text1: 'Success!',
        autoHide: true,
        text2: 'Add event success',
        visibilityTime: 2000,
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error!',
        autoHide: true,
        text2: 'Error, please review the input data!',
        visibilityTime: 3000,
      });
    }
  };

  // const handlePustEvent = async (event: EventModel) => {
  //   const api = `/add-new`;
  //   try {
  //     const res = await eventAPI.HandleEvent(api, event, 'post');
  //     navigation.navigate('Explore', {
  //       screen: 'HomeScreen',
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const handleFileSelected = (val: ImageOrVideo) => {
  //   setFileSelected(val);
  //   handleChangeValue('avatar', val.path);
  // };

  const handleLocation = (val: any) => {
    const items = {...eventData};
    items.position.lat = val.latitude;
    items.position.long = val.longitude;
    items.locationAddress = val.description;
    items.locationTitle = val.main_name_place;
    setEventData(items);
  };

  return (
    <ContainerComponent isScroll turnOffSafeArea>
      {/* <StatusBar translucent /> */}
      {/* <StatusBar translucent barStyle={'light-content'} /> */}
      <StatusBar translucent barStyle={'light-content'} />
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
              text="Add new event"
              title
              color={appColors.white}
            />
          </RowComponent>
        </View>
      </View>

      <SectionComponent styles={{marginTop: 30}}>
        {/* {eventData.avatar || fileSelected ? (
          <Image
            source={{
              uri: eventData.avatar ? eventData.avatar : fileSelected.uri,
            }}
            style={{width: '100%', height: 250, marginBottom: 12}}
            resizeMode="cover"
          />
        ) : (
          <></>
        )}
        <ButtonImagePicker
          onSelect={() => {}}
          // onSelect={(val: any) =>
          //   val.type === 'url'
          //     ? handleChangeValue('avatar', val.value as string)
          //     : handleFileSelected(val.value)
          // }
        /> */}
        <InputComponent
          placeholder="Title"
          value={eventData.title}
          allowClear
          // onChange={() => {}}
          onChange={val => handleChangeValue('title', val)}
        />
        <InputComponent
          placeholder="Description"
          multiline
          numberOfLine={3}
          allowClear
          value={eventData.description}
          // onChange={() => {}}
          onChange={val => handleChangeValue('description', val)}
        />
        {/* <RowComponent
          styles={{
            justifyContent: 'space-between',
            alignItems: 'center',
            // backgroundColor: 'coral',
          }}>
          <InputComponent
            placeholder="Price"
            allowClear
            styles={{width: '48%'}}
            type="number-pad"
            value={eventData.price}
            // onChange={() => {}}
            onChange={val => handleChangeValue('price', val)}
          />
          <View style={{width: '48%'}}>
            <DropdownPicker
              selected={eventData.category}
              values={[
                {
                  label: 'Sport',
                  value: 'sport',
                },
                {
                  label: 'Food',
                  value: 'food',
                },
                {
                  label: 'Art',
                  value: 'art',
                },
                {
                  label: 'Music',
                  value: 'music',
                },
              ]}
              // onSelect={() => {}}
              onSelect={val => handleChangeValue('category', val)}
            />
          </View>
        </RowComponent> */}

        <RowComponent>
          <View style={{width: '35%'}}>
            <DateTimePicker
              label="End at:"
              type="time"
              onSelect={val => handleChangeValue('endAt', val)}
              selected={eventData.endAt}
            />
          </View>
          <SpaceComponent width={15} />
          <DateTimePicker
            label="Date:"
            type="date"
            onSelect={val => handleChangeValue('date', val)}
            selected={eventData.date}
          />
        </RowComponent>

        {/* <DropdownPicker
          label="Invited users"
          values={usersSelects}
          onSelect={() => {}}
          // onSelect={(val: string | string[]) =>
          //   handleChangeValue('users', val as string[])
          // }
          selected={eventData.users}
          multible
        /> */}
        {/* <InputComponent
          placeholder="Title Address"
          allowClear
          value={eventData.locationTitle}
          // onChange={() => {}}
          onChange={val => handleChangeValue('locationTitle', val)}
        /> */}
        <ChoiceLocation
          addressSelected={addressSelected}
          onSelect={val => handleLocation(val)}
          setAddressSelected={(val: LocationModelSuggest) =>
            setAddressSelected(val)
          }
        />
      </SectionComponent>

      {/* {errorsMess.length > 0 && (
        <SectionComponent>
          {errorsMess.map(mess => (
            <TextComponent
              text={mess}
              key={mess}
              color={appColors.danger}
              styles={{marginBottom: 12}}
            />
          ))}
        </SectionComponent>
      )} */}

      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: 270,
        }}>
        <Image
          source={require('../../assets/images/banner-add-event.png')} // ✅ Không dùng uri
          style={{
            width: 180,
            height: 180,

            padding: 10,
            borderRadius: 12,
            resizeMode: 'contain',
          }}
        />
      </View>

      <SectionComponent>
        <ButtonComponent
          disable={errorsMess.length > 0}
          text="Add New"
          onPress={handleAddEvent}
          type="primary"
        />
      </SectionComponent>
    </ContainerComponent>
  );
};

export default AddNewScreen;
