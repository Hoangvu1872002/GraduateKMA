import {
  View,
  Text,
  Platform,
  StatusBar,
  FlatList,
  TextInput,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {appColors} from '../../constants/appColors';
import {fontFamilies} from '../../constants/fontFamilies';
import {HistoryItemComponent, TextComponent} from '../../components';
import {globalStyles} from '../../styles/globalStyles';
import {apiAllBillDriver} from '../../apis';
import {useFocusEffect} from '@react-navigation/native';
import {IBill} from '../../models/BillModel';

const HistoryScreen = () => {
  const [dataHistory, setDataHistory] = useState<IBill[]>([]);
  const [searchKeyword, setSearchKeyword] = useState(''); // Từ khóa tìm kiếm
  const [filteredData, setFilteredData] = useState(dataHistory); // Dữ liệu đã lọc

  const fetchData = async () => {
    const rs = await apiAllBillDriver();
    setDataHistory(rs.data);
    setFilteredData(rs.data); // Cập nhật dữ liệu đã lọc
  };

  const handleSearch = (text: string) => {
    setSearchKeyword(text);
    if (text.trim() === '') {
      setFilteredData(dataHistory); // Hiển thị toàn bộ dữ liệu nếu không có từ khóa
    } else {
      const filtered = dataHistory.filter(
        item =>
          item.pickupAddress.main_name_place
            .toLowerCase()
            .includes(text.toLowerCase()) ||
          item.destinationAddress.main_name_place
            .toLowerCase()
            .includes(text.toLowerCase()),
      );
      setFilteredData(filtered);
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
          <TextComponent
            title
            text="History"
            font={fontFamilies.bold}
            color={appColors.WhiteSmoke}></TextComponent>
        </View>
      </View>

      {/* Ô tìm kiếm */}
      <View
        style={{
          marginTop: 20,
          marginHorizontal: 16,
          backgroundColor: appColors.white,
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 8,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
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
          }}
        />
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
