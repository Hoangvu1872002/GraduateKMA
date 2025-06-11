import {
  View,
  Text,
  StatusBar,
  Platform,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {globalStyles} from '../../styles/globalStyles';
import {appColors} from '../../constants/appColors';
import {
  OrderItemComponent,
  SectionComponent,
  TextComponent,
} from '../../components';
import {fontFamilies} from '../../constants/fontFamilies';

import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../stores/redux';
import {apiUpdateStatusDriver} from '../../apis';
import {getCurrent} from '../../stores/users/asyncAction';
import {clearListOrderReceived} from '../../stores/users/userSlide';

const DRIVER_STATUS = [
  {label: 'Offline', value: 'offline'},
  {label: 'Online', value: 'online'},
  // {label: 'Busy', value: 'busy'},
];

const OrdersScreen = () => {
  // const [dataOrders, setDataOrders] = useState<IBillTemporary[]>([]);

  // useEffect(() => {
  //   socket.on('new-order', data => {
  //     setDataOrders([data]);
  //   });
  // }, []);

  const {listOrderReceived, current} = useSelector(
    (state: RootState) => state.user,
  );

  const dispatch = useDispatch<AppDispatch>();

  // Trạng thái tài xế

  const handleUpdateDriverStatus = async (status: string) => {
    const rs = await apiUpdateStatusDriver({status});
    if (rs.data.status === 'offline') {
      dispatch(clearListOrderReceived([]));
    }
    if (rs.data.success) {
      dispatch(getCurrent());
    }
  };

  return (
    <View style={[globalStyles.container, {flex: 1}]}>
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
            text="List Orders"
            font={fontFamilies.bold}
            color={appColors.WhiteSmoke}></TextComponent>
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          marginTop: 16,
          marginBottom: 8,
        }}>
        {/* Số lượng đơn */}
        <TextComponent
          text={`Total: ${listOrderReceived?.length || 0} orders`}
          font={fontFamilies.semiBold}
          size={16}
          color={appColors.text}
        />
        {/* Nút chọn trạng thái tài xế */}
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#eee',
            borderRadius: 20,
          }}>
          {DRIVER_STATUS.map(status => (
            <TouchableOpacity
              key={status.value}
              onPress={() => handleUpdateDriverStatus(status.value)}
              style={{
                paddingVertical: 6,
                paddingHorizontal: 16,
                borderRadius: 20,
                backgroundColor:
                  current.status === status.value
                    ? appColors.primary
                    : 'transparent',
                marginHorizontal: 2,
              }}>
              <Text
                style={{
                  color:
                    current.status === status.value ? '#fff' : appColors.text,
                  fontWeight:
                    current.status === status.value ? 'bold' : 'normal',
                  fontSize: 14,
                }}>
                {status.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <SectionComponent styles={{flex: 1}}>
        <FlatList
          style={{
            paddingHorizontal: 16,
          }}
          contentContainerStyle={{
            flex: 1,
          }}
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
