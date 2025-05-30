import {
  View,
  Text,
  Button,
  Platform,
  StatusBar,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {
  EventItem,
  InputComponent,
  RowComponent,
  TextComponent,
} from '../../components';
import {fontFamilies} from '../../constants/fontFamilies';
import {appColors} from '../../constants/appColors';
import {globalStyles} from '../../styles/globalStyles';
import {apiGetAllEvent} from '../../apis';
import {useFocusEffect} from '@react-navigation/native';
import {EventModel} from '../../models/EventModel';
import {Add} from 'iconsax-react-native';

const EventsScreen = ({navigation}: any) => {
  const [dataEvent, setDataEvent] = useState<EventModel[]>([]);
  const [filteredData, setFilteredData] = useState<EventModel[]>([]);
  const [valueInput, setValueInput] = useState('');

  const fetchDataEvent = async () => {
    const rs = await apiGetAllEvent();
    setDataEvent(rs.data);
    setFilteredData(rs.data); // Gán dữ liệu ban đầu
  };

  useFocusEffect(
    useCallback(() => {
      fetchDataEvent();
    }, []),
  );

  // Hàm lọc danh sách theo từ khóa nhập vào
  useEffect(() => {
    if (valueInput.trim() === '') {
      setFilteredData(dataEvent);
    } else {
      const filtered = dataEvent.filter(event =>
        event.title.toLowerCase().includes(valueInput.toLowerCase()),
      );
      setFilteredData(filtered);
    }
  }, [valueInput, dataEvent]);

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
          <TextComponent
            title
            text="Events"
            font={fontFamilies.bold}
            color={appColors.WhiteSmoke}
          />
        </View>
      </View>

      <RowComponent
        styles={{
          paddingHorizontal: 15,
          paddingBottom: 10,
          marginTop: 20,
        }}>
        <View style={{flex: 1, marginRight: 15}}>
          <InputComponent
            styles={{marginBottom: 5, minHeight: 40}}
            value={valueInput}
            onChange={val => setValueInput(val)}
            multiline
            placeholder="Aa..."
          />
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('AddNewEvent')}>
          <Add size={30} variant="Bold" color={appColors.BlueDarkTurquoise} />
        </TouchableOpacity>
      </RowComponent>

      <FlatList
        style={{marginTop: 10}}
        contentContainerStyle={{
          alignItems: 'center',
        }}
        showsHorizontalScrollIndicator={false}
        data={filteredData}
        renderItem={({item, index}) => (
          <EventItem
            fetchDataEvent={() => fetchDataEvent()}
            key={`event${index}`}
            item={item}
            type="list"
          />
        )}
      />
    </View>
  );
};

export default EventsScreen;
