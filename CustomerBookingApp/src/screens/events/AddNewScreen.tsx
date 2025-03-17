import {Image, Platform, StatusBar, View} from 'react-native';
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
import {apiGetAllUsers} from '../../apis';
import {globalStyles} from '../../styles/globalStyles';
import {fontFamilies} from '../../constants/fontFamilies';
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
  photoUrl: '',
  users: [],
  authorId: '',
  // startAt: Date.now(),
  endAt: Date.now(),
  date: Date.now(),
  price: '',
  category: '',
};

const AddNewScreen = ({navigation}: any) => {
  // const auth = useSelector(authSelector);

  const {current} = useSelector((state: RootState) => state.user);
  // console.log(current);

  const [eventData, setEventData] = useState<any>({
    ...initValues,
    authorId: current._id,
  });
  const [usersSelects, setUsersSelects] = useState<SelectModel[]>([]);
  const [fileSelected, setFileSelected] = useState<any>();
  const [errorsMess, setErrorsMess] = useState<string[]>([]);

  useEffect(() => {
    handleGetAllUsers();
  }, []);

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

  const handleGetAllUsers = async () => {
    try {
      const res: any = await apiGetAllUsers();

      if (res && res.data && res.data.rs) {
        const items: SelectModel[] = [];

        res.data.rs.forEach(
          (item: any) =>
            item.email &&
            items.push({
              label: item.email,
              value: item._id,
            }),
        );

        setUsersSelects(items);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const handleAddEvent = async () => {
  //   if (fileSelected) {
  //     const filename = `${fileSelected.filename ?? `image-${Date.now()}`}.${
  //       fileSelected.path.split('.')[1]
  //     }`;
  //     const path = `images/${filename}`;

  //     const res = storage().ref(path).putFile(fileSelected.path);

  //     res.on(
  //       'state_changed',
  //       snap => {
  //         console.log(snap.bytesTransferred);
  //       },
  //       error => {
  //         console.log(error);
  //       },
  //       () => {
  //         storage()
  //           .ref(path)
  //           .getDownloadURL()
  //           .then(url => {
  //             eventData.photoUrl = url;

  //             handlePustEvent(eventData);
  //           });
  //       },
  //     );
  //   } else {
  //     handlePustEvent(eventData);
  //   }
  // };

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
  //   handleChangeValue('photoUrl', val.path);
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
          <TextComponent
            title
            text="Add new event"
            font={fontFamilies.bold}
            color={appColors.WhiteSmoke}></TextComponent>
        </View>
      </View>

      <SectionComponent>
        {/* {eventData.photoUrl || fileSelected ? (
          <Image
            source={{
              uri: eventData.photoUrl ? eventData.photoUrl : fileSelected.uri,
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
          //     ? handleChangeValue('photoUrl', val.value as string)
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
        <ChoiceLocation onSelect={val => handleLocation(val)} />
      </SectionComponent>

      {errorsMess.length > 0 && (
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
      )}

      <SectionComponent>
        <ButtonComponent
          disable={errorsMess.length > 0}
          text="Add New"
          // onPress={handleAddEvent}
          type="primary"
        />
      </SectionComponent>
    </ContainerComponent>
  );
};

export default AddNewScreen;
