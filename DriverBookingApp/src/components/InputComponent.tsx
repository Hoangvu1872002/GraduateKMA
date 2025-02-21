import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  TextInputProps,
  KeyboardType,
  StyleProp,
  ViewStyle,
} from 'react-native';
import React, {ReactNode, useState} from 'react';
import {Touchable} from 'react-native';
import {appColors} from '../constants/appColors';
import {globalStyles} from '../styles/globalStyles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CardComponent from './CardComponent';

interface Props {
  value: string;
  onChange: (val: string) => void;
  affix?: ReactNode;
  placeholder?: string;
  suffix?: ReactNode;
  isPassword?: boolean;
  allowClear?: boolean;
  type?: KeyboardType;
  onEnd?: () => void;
  multiline?: boolean;
  numberOfLine?: number;
  width?: number;
  turnOffAutoFocus?: () => void;
  autoFocus?: boolean;
  styles?: StyleProp<ViewStyle>;
}

const InputComponent = (props: Props) => {
  const {
    width,
    value,
    onChange,
    affix,
    suffix,
    placeholder,
    isPassword,
    allowClear,
    type,
    onEnd,
    multiline,
    numberOfLine,
    styles,
    autoFocus,
    turnOffAutoFocus,
  } = props;
  // console.log(turnOffAutoFocus);

  const [isShowPass, setIsShowPass] = useState(isPassword ?? false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      style={[
        globalStyles.inputContainer,
        {
          alignItems: 'center',
          width: width ? `${width}%` : '100%',
          // backgroundColor: 'black',
          borderWidth: 1,
          borderColor: '#ccc',
        },
        (autoFocus || isFocused) && styleForcus.inputFocused,
        styles,
      ]}>
      {affix ?? affix}
      <TextInput
        style={[
          globalStyles.input,
          globalStyles.text,

          {
            paddingHorizontal: affix || suffix ? 12 : 0,
            // backgroundColor: 'coral',
          },
        ]}
        onFocus={() => {
          setIsFocused(true);
          turnOffAutoFocus && turnOffAutoFocus();
        }}
        onBlur={() => setIsFocused(false)}
        multiline={multiline}
        value={value}
        numberOfLines={numberOfLine}
        placeholder={placeholder ?? ''}
        onChangeText={val => onChange(val)}
        secureTextEntry={isShowPass}
        placeholderTextColor={'#747688'}
        keyboardType={type ?? 'default'}
        autoCapitalize="none"
        onEndEditing={onEnd}
      />
      {suffix ?? suffix}

      {isPassword ? (
        <TouchableOpacity
          onPress={
            // isPassword ? () => setIsShowPass(!isShowPass) : () => onChange('')
            () => setIsShowPass(!isShowPass)
          }>
          <FontAwesome
            name={isShowPass ? 'eye-slash' : 'eye'}
            size={22}
            color={appColors.gray}
          />
        </TouchableOpacity>
      ) : (
        value &&
        value.length > 0 &&
        allowClear &&
        isFocused && (
          <CardComponent
            styles={[
              globalStyles.noSpaceCard,

              {
                width: 25,
                height: 25,
                borderRadius: 100,
                borderWidth: 1,
                borderColor: appColors.white2,
              },
            ]}
            onPress={() => onChange('')}
            color={appColors.gray5}>
            <AntDesign name="close" size={15} color={appColors.text} />
          </CardComponent>
        )
      )}
    </View>
  );
};

const styleForcus = StyleSheet.create({
  inputFocused: {
    borderColor: appColors.BlueDarkTurquoise, // Màu border khi focus
  },
});

export default InputComponent;
