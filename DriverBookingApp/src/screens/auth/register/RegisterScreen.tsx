import {Lock, Mobile, Sms, User} from 'iconsax-react-native';
import React, {useEffect, useState} from 'react';
// import {useDispatch} from 'react-redux';
import {
  ButtonComponent,
  ContainerComponent,
  InputComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '../../../components';
import {appColors} from '../../../constants/appColors';
import LoadingModal from '../../../modals/LoadingModal';

import {Validate} from '../../../utils/validate';

import {apiVerification} from '../../../apis/authApi';
import Toast from 'react-native-toast-message';

interface ErrorMessages {
  email: string;
  password: string;
  confirmPassword: string;
}

const initValue = {
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  confirmPassword: '',
  mobile: '',
};

const RegisterScreen = ({navigation}: any) => {
  const [values, setValues] = useState(initValue);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<any>();
  const [isDisable, setIsDisable] = useState(true);

  // const dispatch = useDispatch();

  useEffect(() => {
    if (
      !errorMessage ||
      (errorMessage &&
        (errorMessage.email ||
          errorMessage.password ||
          errorMessage.confirmPassword)) ||
      !values.email ||
      !values.password ||
      !values.confirmPassword
    ) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [errorMessage, values]);

  const handleChangeValue = (key: string, value: string) => {
    const data: any = {...values};

    data[`${key}`] = value;

    setValues(data);
  };

  const formValidator = (key: string) => {
    const data = {...errorMessage};
    let message = ``;

    switch (key) {
      case 'email':
        if (!values.email) {
          message = `Email is required!!!`;
        } else if (!Validate.email(values.email)) {
          message = 'Email is not invalid!!';
        } else {
          message = '';
        }

        break;

      case 'password':
        message = !values.password ? `Password is required!!!` : '';
        break;

      case 'confirmPassword':
        if (!values.confirmPassword) {
          message = `Please type confirm password!!`;
        } else if (values.confirmPassword !== values.password) {
          message = 'Password is not match!!!';
        } else {
          message = '';
        }

        break;
    }

    data[`${key}`] = message;

    setErrorMessage(data);
  };

  const handleRegister = async () => {
    setIsLoading(true);

    // console.log(values);

    try {
      const res = await apiVerification(values);

      setIsLoading(false);

      // console.log(res.data);

      if (res.data.success) {
        navigation.navigate('Verification', {
          code: res.data.code,
          ...values,
        });
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
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <ContainerComponent isImageBackground isScroll back>
        <SectionComponent>
          <TextComponent size={24} title text="Sign up" />
          <SpaceComponent height={21} />
          <RowComponent justify="space-between">
            <InputComponent
              value={values.firstname}
              placeholder="First name"
              width={49}
              // styles={{height: '100%'}}
              onChange={val => handleChangeValue('firstname', val)}
              allowClear
              affix={<User size={22} color={appColors.gray} />}
            />
            <InputComponent
              value={values.lastname}
              placeholder="Last name"
              width={49}
              onChange={val => handleChangeValue('lastname', val)}
              allowClear
              affix={<User size={22} color={appColors.gray} />}
            />
          </RowComponent>
          <InputComponent
            value={values.email}
            placeholder="Abc@email.com"
            onChange={val => handleChangeValue('email', val)}
            allowClear
            affix={<Sms size={22} color={appColors.gray} />}
            onEnd={() => formValidator('email')}
          />
          <InputComponent
            value={values.mobile}
            placeholder="Phone number"
            onChange={val => handleChangeValue('mobile', val)}
            allowClear
            affix={<Mobile size={22} color={appColors.gray} />}
            onEnd={() => formValidator('mobile')}
          />
          <InputComponent
            value={values.password}
            placeholder="Password"
            onChange={val => handleChangeValue('password', val)}
            isPassword
            allowClear
            affix={<Lock size={22} color={appColors.gray} />}
            onEnd={() => formValidator('password')}
          />
          <InputComponent
            value={values.confirmPassword}
            placeholder="Confirm password"
            onChange={val => handleChangeValue('confirmPassword', val)}
            isPassword
            allowClear
            affix={<Lock size={22} color={appColors.gray} />}
            onEnd={() => formValidator('confirmPassword')}
          />
        </SectionComponent>

        {errorMessage && (
          <SectionComponent>
            {Object.keys(errorMessage).map(
              (error, index) =>
                errorMessage[`${error}`] && (
                  <TextComponent
                    text={errorMessage[`${error}`]}
                    key={`error${index}`}
                    color={appColors.danger}
                  />
                ),
            )}
          </SectionComponent>
        )}
        <SpaceComponent height={10} />
        <SectionComponent>
          <ButtonComponent
            onPress={handleRegister}
            text="SIGN UP"
            disable={isDisable}
            type="primary"
          />
        </SectionComponent>

        <SectionComponent>
          <RowComponent justify="center">
            <TextComponent text="Don’t have an account? " />
            <ButtonComponent
              textStyles={{flex: 0}}
              type="link"
              text="Sign in"
              onPress={() => navigation.navigate('LoginScreen')}
            />
          </RowComponent>
        </SectionComponent>
      </ContainerComponent>
      <LoadingModal visible={isLoading} />
    </>
  );
};

export default RegisterScreen;
