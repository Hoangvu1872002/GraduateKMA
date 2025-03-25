import {View, Text, Button, Platform, StatusBar} from 'react-native';
import React, {useRef} from 'react';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {TextComponent} from '../../components';
import {fontFamilies} from '../../constants/fontFamilies';
import {appColors} from '../../constants/appColors';
import {globalStyles} from '../../styles/globalStyles';

const EventsScreen = () => {
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
            text="Events"
            font={fontFamilies.bold}
            color={appColors.WhiteSmoke}></TextComponent>
        </View>
      </View>
      {/* 
  <FlatList
    style={{
      // paddingHorizontal: 16,
      marginTop: 20,
    }}
    contentContainerStyle={{
      flex: 1,
    }} // Định nghĩa layout cho nội dung bên trong
    showsHorizontalScrollIndicator={false}
    data={dataHistory}
    renderItem={({item, index}) => (
      <HistoryItemComponent item={item}></HistoryItemComponent>
    )}
  /> */}
    </View>
  );
};

export default EventsScreen;
