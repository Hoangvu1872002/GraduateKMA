import {
  View,
  Text,
  StatusBar,
  Platform,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {globalStyles} from '../../styles/globalStyles';
import {appColors} from '../../constants/appColors';
import {
  ContainerComponent,
  InputComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '../../components';
import {fontFamilies} from '../../constants/fontFamilies';
import {Edit, Element4} from 'iconsax-react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {useFocusEffect} from '@react-navigation/native';
import {apiGetAllRoomChat} from '../../apis';
import {IRoomChatClient} from '../../models/MessageModal';
import moment from 'moment';
import socket from '../../apis/socket';

const ListRoomMessageScreen = ({navigation}: any) => {
  const [listRoom, setListRoom] = useState<IRoomChatClient[]>([]);
  const [searchText, setSearchText] = useState('');

  const fetchRoomData = async () => {
    try {
      const response = await apiGetAllRoomChat();
      setListRoom(response?.data?.roomChats);
    } catch (error) {
      console.error('Lỗi tải dữ liệu:', error);
    }
  };

  const filteredRooms = listRoom.filter(room =>
    `${room.driver.firstname} ${room.driver.lastname}`
      .toLowerCase()
      .includes(searchText.trim().toLowerCase()),
  );

  useFocusEffect(
    useCallback(() => {
      fetchRoomData(); // Hàm gọi API hoặc xử lý khi vào màn hình

      const handleReceiveMessage = (data: any) => {
        fetchRoomData();
      };

      // Khi màn hình được focus, bật lắng nghe sự kiện socket
      socket.on('receiveMessage', handleReceiveMessage);

      return () => {
        // Khi màn hình mất focus, tắt lắng nghe sự kiện socket
        socket.off('receiveMessage', handleReceiveMessage);
      };
    }, []),
  );

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
            text="Rooms Chat"
            font={fontFamilies.bold}
            color={appColors.WhiteSmoke}></TextComponent>
        </View>
      </View>

      <View style={{flex: 1, marginTop: 20}}>
        <SectionComponent styles={{flex: 1}}>
          {/* Ô tìm kiếm */}
          <InputComponent
            placeholder="Tìm kiếm theo tên tài xế..."
            value={searchText}
            onChange={setSearchText}
            styles={{
              marginBottom: 12,
              borderRadius: 10,
              backgroundColor: '#fff',
              paddingHorizontal: 10,
              borderWidth: 1,
              borderColor: appColors.gray3,
            }}
          />
          <FlatList
            style={{flex: 1}}
            showsVerticalScrollIndicator={false}
            data={filteredRooms}
            keyExtractor={item => item._id}
            renderItem={({item, index}) => (
              <TouchableOpacity
                key={index}
                style={{
                  marginBottom: 10,
                  paddingHorizontal: 12,
                  backgroundColor: '#8DB6CD',
                  borderRadius: 12,
                  paddingVertical: 8,
                }}
                onPress={() =>
                  navigation.navigate('RoomMessageScreen', {
                    roomId: item._id,
                  })
                }>
                <RowComponent styles={{paddingVertical: 10}}>
                  <View
                    style={{
                      flex: 0,
                      marginRight: 10,
                      backgroundColor: '#87CEFF',
                      borderColor: appColors.white,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderWidth: 1,
                      borderRadius: 100,
                      width: 50,
                      height: 50,
                    }}>
                    <TextComponent
                      flex={0}
                      size={22}
                      color={appColors.text2}
                      font={fontFamilies.semiBold}
                      text={`${item.driver.firstname
                        .substring(0, 1)
                        .toUpperCase()}${item.driver.lastname
                        .substring(0, 1)
                        .toUpperCase()}`}
                    />
                  </View>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'flex-start',
                    }}>
                    <RowComponent>
                      <TextComponent
                        flex={0}
                        size={17}
                        color={appColors.white}
                        font={fontFamilies.semiBold}
                        text={`${item.driver.firstname} ${item.driver.lastname}`}
                      />
                      <TextComponent
                        flex={0}
                        size={11}
                        color={appColors.white}
                        font={fontFamilies.regular}
                        text={` - (${item.driver.licensePlate})`}
                      />
                    </RowComponent>
                    <SpaceComponent height={10}></SpaceComponent>
                    <RowComponent
                      justify="space-between"
                      styles={{width: '100%'}}>
                      <TextComponent
                        size={12}
                        font={fontFamilies.medium}
                        color={appColors.white}
                        numOfLine={1}
                        styles={{maxWidth: 160}}
                        text={
                          item.lastestMesage?.message || ' '
                        }></TextComponent>
                      <TextComponent
                        size={12}
                        font={fontFamilies.medium}
                        color={appColors.white}
                        text={moment(item.lastestMesage.createdAt).format(
                          'HH/mm-DD/MM/YYYY',
                        )}></TextComponent>
                    </RowComponent>
                  </View>
                </RowComponent>
              </TouchableOpacity>
            )}
          />
        </SectionComponent>
      </View>
    </View>
  );
};

export default ListRoomMessageScreen;
