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
  const fetchRoomData = async () => {
    try {
      const response = await apiGetAllRoomChat();
      // console.log(response?.data?.roomChats[0].lastestMesage);

      setListRoom(response?.data?.roomChats);
    } catch (error) {
      console.error('Lỗi tải dữ liệu:', error);
    }
  };

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
        // console.log('❌ Socket listener removed');
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
            text="Rooms Chat"
            font={fontFamilies.bold}
            color={appColors.WhiteSmoke}></TextComponent>
        </View>
      </View>

      <View style={{flex: 1, marginTop: 20}}>
        <SectionComponent styles={{flex: 1}}>
          <FlatList
            style={{flex: 1}}
            showsVerticalScrollIndicator={false}
            data={listRoom}
            keyExtractor={item => item._id}
            ListEmptyComponent={
              <SectionComponent>
                <TextComponent text="Data not found!!!" />
              </SectionComponent>
            }
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
                      text={`${item.user.firstname
                        .substring(0, 1)
                        .toUpperCase()}${item.user.lastname
                        .substring(0, 1)
                        .toUpperCase()}`}
                    />
                    {/* <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'absolute',
                        right: -10,
                        top: -8,
                        backgroundColor: 'coral',
                        width: 22,
                        height: 22,
                        borderRadius: 100,
                      }}>
                      <TextComponent
                        styles={{flex: 0, paddingVertical: 0}}
                        text={item.members.length.toString()}
                      />
                    </View> */}
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
                        text={`${item.user.firstname} ${item.user.lastname}`}
                      />
                      <TextComponent
                        flex={0}
                        size={11}
                        color={appColors.white}
                        font={fontFamilies.regular}
                        text={` - (${item.user.mobile})`}
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
                        styles={{maxWidth: 170}}
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
