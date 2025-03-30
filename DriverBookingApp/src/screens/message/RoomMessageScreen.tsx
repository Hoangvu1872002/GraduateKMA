import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StatusBar,
  Platform,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import TextComponent from '../../components/TextComponent';

import SectionComponent from '../../components/SectionComponent';
import RowComponent from '../../components/RowComponent';
import {
  ArrowLeft,
  ArrowLeft2,
  CalendarEdit,
  Clock,
  Send,
  Setting2,
} from 'iconsax-react-native';
import SpaceComponent from '../../components/SpaceComponent';

import {fontFamilies} from '../../constants/fontFamilies';
import {ScrollView} from 'react-native-gesture-handler';

import InputComponent from '../../components/InputComponent';
import {globalStyles} from '../../styles/globalStyles';
import {appColors} from '../../constants/appColors';
import {IMessageClient, IRoomChatClient} from '../../models/MessageModal';
import {useSelector} from 'react-redux';
import {RootState} from '../../stores/redux';
import moment from 'moment';
import socket from '../../apis/socket';
import {apiGetRoomChat} from '../../apis';
import {useFocusEffect} from '@react-navigation/native';

const imageStyle = {
  width: 40,
  height: 40,
  borderRadius: 100,
  borderWidth: 2,
  borderColor: appColors.white,
};

const RoomMessageScreen = ({navigation, route}: any) => {
  const {current} = useSelector((state: RootState) => state.user);

  const flatListRef = useRef<FlatList<IMessageClient>>(null);

  const {roomId}: {roomId: string} = route.params;
  // console.log(item);

  const [valueInput, setValueInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // const [listMessenger, setListMessenger] = useState<IMessageClient[]>([]);
  const [item, setItem] = useState<IRoomChatClient>();

  const handleSubmit = async () => {
    setIsLoading(true);
    const data = {
      senderId: current._id,
      driverId: item?.driver._id,
      roomId: item?._id,
      message: valueInput,
    };
    await socket.emit('sendMessage', data);
    setValueInput('');
    setIsLoading(false);
  };

  const getInfRoomChat = async () => {
    const rs = await apiGetRoomChat({roomId});
    setItem(rs.data);
  };

  useFocusEffect(
    useCallback(() => {
      getInfRoomChat();
      const handleReceiveMessage = (data: any) => {
        getInfRoomChat();
      };

      // Khi màn hình được focus, bật lắng nghe sự kiện socket
      socket.on('receiveMessage', handleReceiveMessage);

      return () => {
        // Khi màn hình mất focus, tắt lắng nghe sự kiện socket
        socket.off('receiveMessage', handleReceiveMessage);
        console.log('❌ Socket listener removed');
      };
    }, [roomId]),
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
              text={`${item?.user.firstname} ${item?.user.lastname} - (${item?.user.mobile})`}
              title
              color={appColors.white}
            />
          </RowComponent>
        </View>
      </View>

      <View style={{flex: 1}}>
        <FlatList
          ref={flatListRef}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({animated: true})
          }
          style={{
            flex: 1,
            paddingTop: 40,
          }}
          showsVerticalScrollIndicator={false}
          data={item?.listMessages}
          keyExtractor={item => item._id}
          // removeClippedSubviews={false} // <- Add This
          ListFooterComponent={<View style={{height: 20}} />}
          renderItem={({item, index}) => (
            <View key={index} style={{marginBottom: 20}}>
              {current?._id === item.sender ? (
                <SectionComponent
                  key={index}
                  styles={{
                    marginHorizontal: -3,
                    marginVertical: -8,
                    justifyContent: 'flex-end',
                  }}>
                  <RowComponent
                    styles={{
                      justifyContent: 'flex-end',
                    }}>
                    <View style={{maxWidth: '65%'}}>
                      <TextComponent
                        styles={{
                          backgroundColor: '#00B2EE',
                          borderRadius: 8,
                          paddingVertical: 5,
                          paddingHorizontal: 10,
                          color: appColors.white,
                        }}
                        font={fontFamilies.medium}
                        flex={0}
                        size={14}
                        text={item.message ?? ''}
                      />
                      <SpaceComponent height={5}></SpaceComponent>
                      <TextComponent
                        flex={0}
                        size={11}
                        font={fontFamilies.medium}
                        styles={{marginRight: 8}}
                        text={moment(item.createdAt).format(
                          'HH:mm / DD-MM-YYYY',
                        )}></TextComponent>
                    </View>
                  </RowComponent>
                </SectionComponent>
              ) : (
                <RowComponent key={index} justify="flex-start">
                  <SectionComponent
                    styles={{
                      marginHorizontal: -3,
                      marginVertical: -8,
                      maxWidth: '65%',
                    }}>
                    <RowComponent justify="flex-start">
                      <View style={{marginRight: 10}}>
                        <View
                          style={[
                            imageStyle,
                            {
                              justifyContent: 'center',
                              alignItems: 'center',
                              backgroundColor: appColors.gray2,
                            },
                          ]}>
                          <Text
                            style={[
                              globalStyles.text,
                              {
                                fontFamily: fontFamilies.bold,
                                fontSize: 14,
                              },
                            ]}>
                            {(item.sender ? item.sender : '')
                              .substring(0, 1)
                              .toUpperCase()}
                          </Text>
                        </View>
                      </View>
                      <View style={{justifyContent: 'flex-start'}}>
                        <View
                          style={{
                            justifyContent: 'flex-start',
                          }}>
                          <TextComponent
                            styles={{
                              backgroundColor: appColors.gray2,
                              borderRadius: 8,
                              paddingVertical: 5,
                              paddingHorizontal: 10,
                              color: 'black',
                            }}
                            font={fontFamilies.medium}
                            flex={0}
                            size={14}
                            text={item.message ?? ''}
                          />
                          <SpaceComponent height={5}></SpaceComponent>
                          <TextComponent
                            flex={0}
                            size={11}
                            font={fontFamilies.medium}
                            styles={{marginRight: 8}}
                            text={moment(item.createdAt).format(
                              'HH:mm / DD-MM-YYYY',
                            )}></TextComponent>
                        </View>
                      </View>
                    </RowComponent>
                  </SectionComponent>
                </RowComponent>
              )}
            </View>
          )}
        />
      </View>

      <RowComponent
        styles={{
          paddingHorizontal: 15,
          paddingBottom: 10,
          paddingTop: 5,
        }}>
        <View style={{flex: 1, marginRight: 15}}>
          <InputComponent
            styles={{marginBottom: 5}}
            value={valueInput}
            multiline
            onChange={val => setValueInput(val)}
            placeholder="Aa..."></InputComponent>
        </View>
        <TouchableOpacity onPress={() => handleSubmit()}>
          <Send size={30} color={appColors.gray}></Send>
        </TouchableOpacity>
      </RowComponent>
    </View>
  );
};

export default RoomMessageScreen;
