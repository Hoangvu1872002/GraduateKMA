import {View, Text, StatusBar, Platform, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import {globalStyles} from '../../styles/globalStyles';
import {appColors} from '../../constants/appColors';
import {
  OrderItemComponent,
  SectionComponent,
  TextComponent,
} from '../../components';
import {fontFamilies} from '../../constants/fontFamilies';
import socket from '../../apis/socket';
import {LocationModelSuggest} from '../../../models/LocationModel';
import {IBillTemporary} from '../../../models/SelectModel';
import {useSelector} from 'react-redux';
import {RootState} from '../../stores/redux';

const OrdersScreen = () => {
  // const [dataOrders, setDataOrders] = useState<IBillTemporary[]>([]);

  // useEffect(() => {
  //   socket.on('new-order', data => {
  //     setDataOrders([data]);
  //   });
  // }, []);

  const {listOrderReceived} = useSelector((state: RootState) => state.user);

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
            text="List Orders"
            font={fontFamilies.bold}
            color={appColors.WhiteSmoke}></TextComponent>
        </View>
      </View>

      <SectionComponent styles={{flex: 1}}>
        <FlatList
          style={{
            paddingHorizontal: 16,
          }}
          contentContainerStyle={{
            flex: 1,
          }} // Định nghĩa layout cho nội dung bên trong
          showsHorizontalScrollIndicator={false}
          data={listOrderReceived}
          renderItem={({item, index}) => (
            <OrderItemComponent item={item}></OrderItemComponent>
          )}
        />
      </SectionComponent>
    </View>
  );
};

export default OrdersScreen;
