import {
  View,
  Text,
  Platform,
  StatusBar,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {appColors} from '../../constants/appColors';
import {fontFamilies} from '../../constants/fontFamilies';
import {
  HistoryItemComponent,
  RowComponent,
  TextComponent,
} from '../../components';
import {globalStyles} from '../../styles/globalStyles';
import {apiAllBill} from '../../apis';
import {useFocusEffect} from '@react-navigation/native';
import {IBill} from '../../models/BillModel';
import {ArrowLeft} from 'iconsax-react-native';
import {ArrowDown2} from 'iconsax-react-native';

const STATUS_OPTIONS = [
  {label: 'All', value: ''},
  {label: 'RECEIVED', value: 'RECEIVED'},
  {label: 'PENDING', value: 'PENDING'},
  {label: 'COMPLETED', value: 'COMPLETED'},
  {label: 'CANCELED', value: 'CANCELED'},
];

const HistoryScreen = ({navigation, route}: any) => {
  const [dataHistory, setDataHistory] = useState<IBill[]>([]);
  const [searchKeyword, setSearchKeyword] = useState(''); // Từ khóa tìm kiếm
  const [filteredData, setFilteredData] = useState(dataHistory); // Dữ liệu đã lọc
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showStatusOptions, setShowStatusOptions] = useState(false);

  const fetchData = async () => {
    const rs = await apiAllBill();
    setDataHistory(rs.data);
    setFilteredData(rs.data); // Cập nhật dữ liệu đã lọc
  };

  const handleStatusSelect = (status: string) => {
    setSelectedStatus(status);
    setShowStatusOptions(false);
    // Lọc lại dữ liệu khi chọn trạng thái
    if (status === '') {
      setFilteredData(
        searchKeyword.trim() === ''
          ? dataHistory
          : dataHistory.filter(
              item =>
                item.pickupAddress.main_name_place
                  .toLowerCase()
                  .includes(searchKeyword.toLowerCase()) ||
                item.destinationAddress.main_name_place
                  .toLowerCase()
                  .includes(searchKeyword.toLowerCase()),
            ),
      );
    } else {
      setFilteredData(
        dataHistory.filter(
          item =>
            (searchKeyword.trim() === '' ||
              item.pickupAddress.main_name_place
                .toLowerCase()
                .includes(searchKeyword.toLowerCase()) ||
              item.destinationAddress.main_name_place
                .toLowerCase()
                .includes(searchKeyword.toLowerCase())) &&
            item.status === status,
        ),
      );
    }
  };

  // Sửa lại handleSearch để kết hợp lọc theo trạng thái
  const handleSearch = (text: string) => {
    setSearchKeyword(text);
    if (text.trim() === '' && !selectedStatus) {
      setFilteredData(dataHistory);
    } else {
      setFilteredData(
        dataHistory.filter(
          item =>
            (text.trim() === '' ||
              item.pickupAddress.main_name_place
                .toLowerCase()
                .includes(text.toLowerCase()) ||
              item.destinationAddress.main_name_place
                .toLowerCase()
                .includes(text.toLowerCase())) &&
            (selectedStatus === '' || item.status === selectedStatus),
        ),
      );
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
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
              text={'History'}
              title
              color={appColors.white}
            />
          </RowComponent>
        </View>
      </View>

      {/* Ô tìm kiếm + Ô chọn trạng thái */}
      <View
        style={{
          marginTop: 20,
          marginHorizontal: 16,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        {/* Ô tìm kiếm */}
        <View
          style={{
            flex: 1,
            backgroundColor: appColors.white,
            borderRadius: 8,
            paddingHorizontal: 12,
            // Bỏ paddingVertical, dùng height để đồng bộ với ô select
            height: 50,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
            justifyContent: 'center',
          }}>
          <TextInput
            placeholder="Search by location..."
            placeholderTextColor={appColors.text2}
            value={searchKeyword}
            onChangeText={handleSearch}
            style={{
              fontSize: 14,
              fontFamily: fontFamilies.medium,
              color: appColors.text,
              paddingVertical: 0, // Đảm bảo text nằm giữa
            }}
          />
        </View>
        {/* Ô select trạng thái */}
        <View style={{width: 110, marginLeft: 10}}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: '#ddd',
              borderRadius: 8,
              backgroundColor: '#fff',
              height: 50, // Đặt chiều cao giống ô tìm kiếm
              paddingHorizontal: 12,
              justifyContent: 'space-between',
            }}
            onPress={() => setShowStatusOptions(!showStatusOptions)}
            activeOpacity={0.8}>
            <Text style={{fontSize: 14, color: appColors.text}}>
              {STATUS_OPTIONS.find(opt => opt.value === selectedStatus)
                ?.label || 'All'}
            </Text>
          </TouchableOpacity>
          {/* Dropdown options */}
          {showStatusOptions && (
            <View
              style={{
                position: 'absolute',
                top: 55,
                left: 0,
                right: 0,
                backgroundColor: '#fff',
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#ddd',
                zIndex: 10,
                elevation: 5,
              }}>
              {STATUS_OPTIONS.map(opt => (
                <TouchableOpacity
                  key={opt.value}
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 12,
                    borderBottomWidth:
                      opt.value !==
                      STATUS_OPTIONS[STATUS_OPTIONS.length - 1].value
                        ? 1
                        : 0,
                    borderBottomColor: '#eee',
                  }}
                  onPress={() => handleStatusSelect(opt.value)}>
                  <Text style={{fontSize: 14, color: appColors.text}}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>

      {/* Danh sách lịch sử */}
      <FlatList
        style={{
          marginTop: 20,
        }}
        contentContainerStyle={{
          paddingHorizontal: 16, // Thêm padding ngang nếu cần
          paddingBottom: 20, // Thêm khoảng trống ở cuối danh sách
        }}
        showsHorizontalScrollIndicator={false}
        data={filteredData} // Dữ liệu đã lọc
        renderItem={({item, index}) => (
          <HistoryItemComponent item={item}></HistoryItemComponent>
        )}
        keyExtractor={(item, index) => index.toString()} // Đảm bảo mỗi item có key duy nhất
      />
    </View>
  );
};

export default HistoryScreen;
