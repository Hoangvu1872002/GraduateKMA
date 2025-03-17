import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  StyleProp,
  ViewStyle,
} from 'react-native';
import React, {ReactNode} from 'react';
import {globalStyles} from '../styles/globalStyles';
import {useNavigation} from '@react-navigation/native';

import {appColors} from '../constants/appColors';
import {fontFamilies} from '../constants/fontFamilies';
import RowComponent from './RowComponent';
import TextComponent from './TextComponent';
import {ArrowLeft} from 'iconsax-react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

interface Props {
  isImageBackground?: boolean;
  isScroll?: boolean;
  title?: string;
  children: ReactNode;
  back?: boolean;
  backModal?: () => void;
  turnOffSafeArea?: boolean;
}

const ContainerComponent = (props: Props) => {
  const {
    children,
    isScroll,
    isImageBackground,
    title,
    back,
    backModal,
    turnOffSafeArea,
  } = props;

  const navigation: any = useNavigation();

  const headerComponent = () => {
    return (
      <View style={{flex: 1}}>
        {(title || back) && (
          <RowComponent
            styles={{
              paddingHorizontal: 16,
              paddingVertical: 10,
              minWidth: 48,
              minHeight: 48,
              justifyContent: 'flex-start',
            }}>
            {back && (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{marginRight: 12}}>
                <ArrowLeft size={24} color={appColors.text} />
              </TouchableOpacity>
            )}
            {backModal && (
              <TouchableOpacity onPress={backModal} style={{marginRight: 12}}>
                <ArrowLeft size={24} color={appColors.text} />
              </TouchableOpacity>
            )}
            {title ? (
              <TextComponent
                text={title}
                size={16}
                font={fontFamilies.medium}
                flex={1}
              />
            ) : (
              <></>
            )}
          </RowComponent>
        )}
        {returnContainer}
      </View>
    );
  };

  const returnContainer = isScroll ? (
    <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  ) : (
    <View style={{flex: 1}}>{children}</View>
  );

  return isImageBackground ? (
    <ImageBackground
      source={require('../assets/images/splash-img.png')}
      style={{flex: 1}}
      imageStyle={{flex: 1}}>
      <SafeAreaView style={{flex: 1, marginTop: -10}}>
        {headerComponent()}
      </SafeAreaView>
    </ImageBackground>
  ) : (
    <>
      {turnOffSafeArea ? (
        <View
          style={[
            globalStyles.container,
            // {paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0},
          ]}>
          {headerComponent()}
        </View>
      ) : (
        <SafeAreaView style={[globalStyles.container]}>
          {/* <StatusBar barStyle={'dark-content'} /> */}
          <View
            style={[
              globalStyles.container,
              // {paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0},
            ]}>
            {headerComponent()}
          </View>
        </SafeAreaView>
      )}
    </>
  );
};

export default ContainerComponent;
