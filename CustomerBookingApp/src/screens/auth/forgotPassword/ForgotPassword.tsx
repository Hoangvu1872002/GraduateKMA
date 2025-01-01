import {View, Text, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  ButtonComponent,
  ContainerComponent,
  InputComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '../../../components';
import {ArrowRight, Sms} from 'iconsax-react-native';
import {appColors} from '../../../constants/appColors';
import LoadingModal from '../../../modals/LoadingModal';
import {fontFamilies} from '../../../constants/fontFamilies';
import {Validate} from '../../../utils/validate';
import {apiForgotpassword} from '../../../apis/authApi';
import Toast from 'react-native-toast-message';
// import {Validate} from '../../utils/validate';

// import authenticationAPI from '../../apis/authApi';

const ForgotPassword = ({navigation, route}: any) => {
  const [email, setEmail] = useState('');
  const [isDisable, setIsDisable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckEmail = () => {
    const isValidEmail = Validate.email(email);
    setIsDisable(!isValidEmail);
  };

  const handleForgotPassword = async () => {
    setIsLoading(true);
    try {
      const res: any = await apiForgotpassword({email});
      // console.log(res.data);

      setIsLoading(false);
      if (res.data.success) {
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
    } catch (error: any) {
      setIsLoading(false);
      Toast.show({
        type: 'error',
        text1: 'Error!',
        autoHide: true,
        text2: error.data.mes,
        visibilityTime: 2000,
      });
      // console.log(`Can not create new password api forgot password, ${error}`);
    }
  };

  return (
    <ContainerComponent back isImageBackground isScroll>
      <SectionComponent>
        <TextComponent text="Resset Password" title />
        <SpaceComponent height={12} />
        <TextComponent
          font={fontFamilies.medium}
          text="Please enter your email address to request a password reset"
        />
        <SpaceComponent height={26} />
        <InputComponent
          value={email}
          onChange={val => setEmail(val)}
          affix={<Sms size={20} color={appColors.gray} />}
          placeholder="abc@gmail.com"
          onEnd={handleCheckEmail}
        />
      </SectionComponent>
      <SectionComponent>
        <ButtonComponent
          onPress={handleForgotPassword}
          disable={isDisable}
          text="Send"
          type="primary"
          icon={<ArrowRight size={20} color={appColors.white} />}
          iconFlex="right"
        />
      </SectionComponent>
      <LoadingModal visible={isLoading} />
    </ContainerComponent>
  );
};

export default ForgotPassword;
