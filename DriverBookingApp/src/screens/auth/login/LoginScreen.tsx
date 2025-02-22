import {Cake, Lock, Sms} from 'iconsax-react-native';
import React, {useEffect, useState} from 'react';
import {Alert, Image, Switch} from 'react-native';
// import authenticationAPI from '../../apis/authApi';

import {appColors} from '../../../constants/appColors';
import {
  ButtonComponent,
  ContainerComponent,
  InputComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '../../../components';
import {Validate} from '../../../utils/validate';
import {useDispatch, useSelector} from 'react-redux';
import {apiLogin} from '../../../apis/authApi';
import {login} from '../../../stores/users/userSlide';
import {getCurrent} from '../../../stores/users/asyncAction';
import {AppDispatch, RootState} from '../../../stores/redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import LoadingModal from '../../../modals/LoadingModal';

const LoginScreen = ({navigation}: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRemember, setIsRemember] = useState(true);
  const [isDisable, setIsDisable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const getSavedAccount = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('accountSave');

      if (jsonValue !== null) {
        const account = JSON.parse(jsonValue);
        setEmail(account.email);
        setPassword(account?.password);
        // console.log('Account:', account); // {email, password}
        return account;
      } else {
        console.log('No data found!');
        return null;
      }
    } catch (e) {
      console.error('Failed to fetch the data from storage', e);
    }
  };

  const removeAccountSave = async () => {
    try {
      await AsyncStorage.removeItem('accountSave');
      console.log('Dữ liệu của accountSave đã được xóa.');
    } catch (e) {
      console.error('Không thể xóa dữ liệu:', e);
    }
  };

  useEffect(() => {
    const emailValidation = Validate.email(email);

    if (!email || !password || !emailValidation) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [email, password]);

  useEffect(() => {
    getSavedAccount();
  }, []);

  const handleLogin = async () => {
    const emailValidation = Validate.email(email);
    if (emailValidation) {
      setIsLoading(true);
      try {
        const rs = await apiLogin({email, password});
        // console.log(rs);

        if (rs.data.success) {
          dispatch(
            login({
              isLoggedIn: true,
              token: rs.data.accessToken,
            }),
          );
          // searchParams.get("redirect")
          //   ? navigate(searchParams.get("redirect"))
          //   : navigate(`/${path.HOME}`);
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error!',
            autoHide: true,
            text2: rs.data.mes,
            visibilityTime: 2000,
          });
        }
        // dispatch(addAuth(res.data));

        if (isRemember) {
          await AsyncStorage.setItem(
            'accountSave',
            JSON.stringify({email, password}),
          );
        } else {
          removeAccountSave();
          // await AsyncStorage.setItem('accountSave', JSON.stringify({email}));
        }
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    } else {
      Alert.alert('Email is not correct!!!!');
    }
  };

  return (
    <ContainerComponent isImageBackground isScroll>
      <SectionComponent
        styles={{
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 65,
        }}>
        <Image
          source={require('../../../assets/images/text-logo.png')}
          style={{
            width: 162,
            height: 114,
            marginBottom: 30,
          }}
        />
      </SectionComponent>
      <SectionComponent>
        <TextComponent size={24} title text="Sign in" />
        <SpaceComponent height={21} />
        <InputComponent
          value={email}
          placeholder="Email"
          onChange={val => setEmail(val)}
          allowClear
          affix={<Sms size={22} color={appColors.gray} />}
        />
        <InputComponent
          value={password}
          placeholder="Password"
          onChange={val => setPassword(val)}
          isPassword
          allowClear
          affix={<Lock size={22} color={appColors.gray} />}
        />
        <RowComponent justify="space-between" styles={{backgroundColor: ''}}>
          <RowComponent onPress={() => setIsRemember(!isRemember)}>
            <Switch
              trackColor={{true: appColors.primary}}
              thumbColor={appColors.white}
              value={isRemember}
              onChange={() => setIsRemember(!isRemember)}
            />
            <SpaceComponent width={4} />
            <TextComponent text="Remember me" />
          </RowComponent>
          <ButtonComponent
            textStyles={{flex: 0}}
            text="Forgot Password?"
            onPress={() => navigation.navigate('ForgotPassword')}
            type="text"
          />
        </RowComponent>
      </SectionComponent>
      <SpaceComponent height={16} />
      <SectionComponent>
        <ButtonComponent
          disable={isLoading || isDisable}
          onPress={() => handleLogin()}
          text="SIGN IN"
          type="primary"
        />
      </SectionComponent>
      <SectionComponent>
        <RowComponent justify="center">
          <TextComponent text="Don't have an account? " />
          <ButtonComponent
            textStyles={{flex: 0}}
            type="link"
            text="Sign up"
            onPress={() => navigation.navigate('RegisterScreen')}
          />
        </RowComponent>
      </SectionComponent>
      <LoadingModal visible={isLoading} />
    </ContainerComponent>
  );
};

export default LoginScreen;
