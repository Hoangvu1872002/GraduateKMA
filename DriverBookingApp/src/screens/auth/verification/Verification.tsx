import {View, Text, TextInput, StyleSheet} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  ButtonComponent,
  ContainerComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '../../../components';
import {ArrowRight} from 'iconsax-react-native';
import {appColors} from '../../../constants/appColors';
import {fontFamilies} from '../../../constants/fontFamilies';
import {globalStyles} from '../../../styles/globalStyles';
// import authenticationAPI from '../../apis/authApi';

// import {useDispatch} from 'react-redux';
// import {addAuth} from '../../redux/reducers/authReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingModal from '../../../modals/LoadingModal';
import {apiRegister, apiVerification} from '../../../apis/authApi';
import Toast from 'react-native-toast-message';

const Verification = ({navigation, route}: any) => {
  const {code, email, password, firstname, lastname, mobile} = route.params;

  const [currentCode, setCurrentCode] = useState<string>(code);
  const [codeValues, setCodeValues] = useState<string[]>([]);
  const [newCode, setNewCode] = useState('');
  const [limit, setLimit] = useState(120);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const ref1 = useRef<any>();
  const ref2 = useRef<any>();
  const ref3 = useRef<any>();
  const ref4 = useRef<any>();

  //   const dispatch = useDispatch();

  useEffect(() => {
    ref1.current.focus();
  }, []);

  useEffect(() => {
    if (limit > 0) {
      const interval = setInterval(() => {
        setLimit(limit => limit - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [limit]);

  useEffect(() => {
    let item = ``;

    codeValues.forEach(val => (item += val));

    setNewCode(item);
  }, [codeValues]);

  const handleChangeCode = (val: string, index: number) => {
    const data = [...codeValues];
    data[index] = val;

    setCodeValues(data);
  };

  const handleResendVerification = async () => {
    setCodeValues(['', '', '', '']);
    setNewCode('');
    setErrorMessage('');

    setIsLoading(true);
    try {
      const res = await apiVerification({email});

      setLimit(120);
      setCurrentCode(res.data.code);
      setIsLoading(false);
      // console.log(res.data.code);
    } catch (error) {
      setIsLoading(false);
      console.log(`Can not send verification code ${error}`);
    }
  };

  const handleVerification = async () => {
    if (limit > 0) {
      if (parseInt(newCode) !== parseInt(currentCode)) {
        setErrorMessage('Invalid code!!!');
      } else {
        setErrorMessage('');
        const data = {
          email,
          password,
          firstname,
          lastname,
          mobile,
        };

        try {
          // console.log('abc');
          const res: any = await apiRegister(data);
          if (res.data.success) {
            console.log('abc');
            // console.log(res.data);

            Toast.show({
              type: 'success',
              text1: 'Success!',
              autoHide: true,
              text2: res.data.mes,
              visibilityTime: 2000,
            });
            navigation.navigate('LoginScreen');
          } else {
            Toast.show({
              type: 'error',
              text1: 'Error!',
              autoHide: true,
              text2: res.data.mes,
              visibilityTime: 2000,
            });
          }
        } catch (error) {
          setErrorMessage('User has already exist!!!');
          console.log(`Can not create new user ${error}`);
        }
      }
    } else {
      setErrorMessage('Time out verification code, please resend new code!!!');
    }
  };

  return (
    <ContainerComponent back isImageBackground isScroll>
      <SectionComponent>
        <SpaceComponent height={15} />
        <TextComponent text="Verification" title />
        <SpaceComponent height={15} />
        <TextComponent
          numOfLine={2}
          font={fontFamilies.medium}
          text={`We’ve send you the verification code on ${email.replace(
            /.{1,8}/,
            (m: any) => '*'.repeat(m.length),
          )}`}
        />
        <SpaceComponent height={25} />
        <RowComponent justify="space-around" styles={{marginHorizontal: -10}}>
          <TextInput
            keyboardType="number-pad"
            ref={ref1}
            value={codeValues[0]}
            style={[styles.input]}
            maxLength={1}
            onChangeText={val => {
              val.length > 0 && ref2.current.focus();
              handleChangeCode(val, 0);
            }}
            // onChange={() => }
            placeholder="-"
          />
          <TextInput
            ref={ref2}
            value={codeValues[1]}
            keyboardType="number-pad"
            onChangeText={val => {
              handleChangeCode(val, 1);
              val.length > 0 && ref3.current.focus();
            }}
            style={[styles.input]}
            maxLength={1}
            placeholder="-"
          />
          <TextInput
            keyboardType="number-pad"
            value={codeValues[2]}
            ref={ref3}
            onChangeText={val => {
              handleChangeCode(val, 2);
              val.length > 0 && ref4.current.focus();
            }}
            style={[styles.input]}
            maxLength={1}
            placeholder="-"
          />
          <TextInput
            keyboardType="number-pad"
            ref={ref4}
            value={codeValues[3]}
            onChangeText={val => {
              handleChangeCode(val, 3);
            }}
            style={[styles.input]}
            maxLength={1}
            placeholder="-"
          />
        </RowComponent>
      </SectionComponent>
      <SectionComponent styles={{marginTop: 15, marginHorizontal: -10}}>
        <ButtonComponent
          disable={newCode.length !== 4}
          onPress={handleVerification}
          text="Continue"
          textStyles={{fontSize: 17}}
          type="primary"
          iconFlex="right"
          icon={
            <View
              style={[
                globalStyles.iconContainer,
                {
                  backgroundColor:
                    newCode.length !== 4 ? appColors.gray : appColors.primary,
                },
              ]}>
              <ArrowRight size={18} color={appColors.white} />
            </View>
          }
        />
      </SectionComponent>
      {errorMessage && (
        <SectionComponent styles={{marginTop: -20}}>
          <TextComponent
            // size={16}
            styles={{textAlign: 'center'}}
            font={fontFamilies.medium}
            text={errorMessage}
            color={appColors.danger}
          />
        </SectionComponent>
      )}
      <SectionComponent styles={{marginTop: -15}}>
        {limit > 0 ? (
          <RowComponent justify="center">
            <TextComponent
              font={fontFamilies.medium}
              text="Re-send code in  "
              flex={0}
            />
            <TextComponent
              font={fontFamilies.medium}
              text={`${(limit - (limit % 60)) / 60}:${
                limit - (limit - (limit % 60))
              }`}
              flex={0}
              color={appColors.link}
            />
          </RowComponent>
        ) : (
          <RowComponent>
            <ButtonComponent
              type="link"
              text="Resend email verification"
              onPress={handleResendVerification}
            />
          </RowComponent>
        )}
      </SectionComponent>
      <LoadingModal visible={isLoading} />
    </ContainerComponent>
  );
};

export default Verification;

const styles = StyleSheet.create({
  input: {
    height: 55,
    width: 55,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: appColors.gray2,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 24,
    fontFamily: fontFamilies.bold,
    textAlign: 'center',
  },
});
