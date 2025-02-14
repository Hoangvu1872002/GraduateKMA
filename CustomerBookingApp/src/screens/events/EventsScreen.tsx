import {View, Text, Button} from 'react-native';
import React, {useRef} from 'react';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {TextComponent} from '../../components';

const EventsScreen = () => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  return (
    <BottomSheetModalProvider>
      <View>
        <Button
          title="Mở Bottom Sheet"
          onPress={() => {
            bottomSheetModalRef.current?.present();
          }}
        />
        <Button
          title="Đóng Bottom Sheet"
          onPress={() => {
            bottomSheetModalRef.current?.dismiss();
          }}
        />
        <BottomSheetModal ref={bottomSheetModalRef} snapPoints={['30%']}>
          <View style={{height: 300, width: '100%', backgroundColor: 'coral'}}>
            <TextComponent text="test"></TextComponent>
          </View>
        </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  );
};

export default EventsScreen;
