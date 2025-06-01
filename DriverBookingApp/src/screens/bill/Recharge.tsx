import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Platform,
  Alert,
  Modal,
} from 'react-native';
import {appColors} from '../../constants/appColors';
import {ArrowLeft, Moneys} from 'iconsax-react-native';
import TextComponent from '../../components/TextComponent';
import {globalStyles} from '../../styles/globalStyles';
import RowComponent from '../../components/RowComponent';
import {fontFamilies} from '../../constants/fontFamilies';
import ButtonComponent from '../../components/ButtonComponent';
import {SectionComponent, SpaceComponent} from '../../components';
import InputComponent from '../../components/InputComponent';
import {useStripe} from '@stripe/stripe-react-native';
import {apiRecharge} from '../../apis';
import {useDispatch, useSelector} from 'react-redux';
import {getCurrent} from '../../stores/users/asyncAction';
import {AppDispatch, RootState} from '../../stores/redux';

const quickAmounts = [10, 20, 50, 100];

const Recharge = ({navigation}: any) => {
  const stripe = useStripe();

  const dispatch = useDispatch<AppDispatch>();
  const {current} = useSelector((state: RootState) => state.user);

  const [amount, setAmount] = useState('');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [done, setDone] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
    setSelectedAmount(value);
  };

  const showCustomAlert = (message: string, done?: boolean) => {
    setAlertMessage(message);
    setAlertVisible(true);
    setDone(done || false);
  };

  const handleRecharge = async () => {
    try {
      // sending request
      const response = await apiRecharge({
        cost: Number(amount),
      });

      if (!response.data) return showCustomAlert(response?.data?.message);
      const clientSecret = response?.data?.clientSecret;
      const initSheet = await stripe.initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: 'Driver Booking App',
      });

      if (initSheet.error) return showCustomAlert(initSheet.error.message);

      const presentSheet = await stripe.presentPaymentSheet();
      if (presentSheet.error)
        return showCustomAlert(presentSheet.error.message);

      showCustomAlert('Payment complete, thank you!', true);
      dispatch(getCurrent());
    } catch (err) {
      console.error(err);
      Alert.alert('Something went wrong, try again later!');
    }
  };
  return (
    <View
      style={[
        globalStyles.container,
        {flex: 1, backgroundColor: appColors.gray6, position: 'relative'},
      ]}>
      {/* Header */}
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
              text="Recharge"
              title
              color={appColors.white}
            />
          </RowComponent>
        </View>
      </View>

      <View style={{padding: 16}}>
        {/* Nhập số tiền */}
        <View
          style={{
            backgroundColor: '#F7F7F9',
            borderRadius: 16,
            borderWidth: 1,
            borderColor: appColors.gray3,
            padding: 16,
            marginBottom: 16,
          }}>
          <TextComponent
            color={appColors.gray4}
            styles={{marginBottom: 6}}
            text="Enter amount ($)"
          />
          <RowComponent
            justify="flex-start"
            styles={{
              alignItems: 'center',
            }}>
            <InputComponent
              value={amount}
              onChange={val => {
                setAmount(val.replace(/[^0-9]/g, ''));
                setSelectedAmount(null);
              }}
              placeholder="0 $"
              type="numeric"
              styles={{
                flex: 1,
                borderBlockColor: appColors.primary,
                borderWidth: 0.5,
                elevation: 0,
                shadowColor: 'transparent',
              }}
              textSizes={16}
              affix={<Moneys size="22" variant="Bold" color="green" />}
              suffix={null}
              allowClear
            />
          </RowComponent>
          <TextComponent
            color={appColors.gray4}
            size={13}
            font={fontFamilies.semiBold}
            text={`Current wallet balance: ${current.balence
              .toFixed(2)
              .toString()} $`}
            styles={{fontWeight: 'normal'}}
          />
        </View>

        {/* Quick select amounts */}
        <RowComponent justify="space-between" styles={{marginBottom: 16}}>
          {quickAmounts.map(val => (
            <TouchableOpacity
              key={val}
              onPress={() => handleQuickAmount(val)}
              style={{
                flex: 1,
                marginHorizontal: 4,
                backgroundColor: '#F7F7F9',
                borderRadius: 12,
                paddingVertical: 12,
                alignItems: 'center',
                borderWidth: 1,
                borderColor:
                  selectedAmount === val ? appColors.primary : appColors.gray3,
                // Thêm shadow nhẹ nếu muốn nổi bật hơn
                shadowColor:
                  selectedAmount === val ? appColors.primary : '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: selectedAmount === val ? 0.15 : 0.05,
                shadowRadius: 4,
                elevation: selectedAmount === val ? 2 : 0,
              }}>
              <TextComponent
                color={
                  selectedAmount === val ? appColors.primary : appColors.text
                }
                font={fontFamilies.medium}
                size={16}
                text={val.toLocaleString('en-US') + ' $'}
              />
            </TouchableOpacity>
          ))}
        </RowComponent>

        {/* Payment method */}
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 16,
            borderWidth: 1.5,
            borderColor: appColors.gray3,
            padding: 16,
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 16,
          }}>
          <TextComponent
            color={appColors.danger}
            size={18}
            text="★"
            styles={{marginRight: 8}}
          />
          <SpaceComponent width={8} />
          <View style={{flex: 1}}>
            <TextComponent color={appColors.gray4} text="Payment method" />
            <SpaceComponent height={4} />
            <TextComponent
              color={appColors.text}
              font={fontFamilies.medium}
              text="Stripe"
            />
          </View>
        </View>

        {/* Total */}
        <View
          style={{
            backgroundColor: '#F7F7F9',
            borderRadius: 16,
            borderWidth: 1,
            borderColor: appColors.gray3,
            padding: 16,
            marginBottom: 16,
          }}>
          <RowComponent justify="space-between" styles={{marginBottom: 8}}>
            <TextComponent
              color={appColors.gray4}
              font={fontFamilies.medium}
              text="Recharge amount"
            />
            <TextComponent
              color={appColors.text}
              size={15}
              font={fontFamilies.medium}
              text={
                amount ? Number(amount).toLocaleString('en-US') + ' $' : '0 $'
              }
            />
          </RowComponent>
          <RowComponent justify="space-between">
            <TextComponent
              color={appColors.gray4}
              size={16}
              font={fontFamilies.medium}
              text="Total"
            />
            <TextComponent
              color={appColors.danger}
              size={16}
              font={fontFamilies.semiBold}
              text={
                amount ? Number(amount).toLocaleString('en-US') + ' $' : '0 $'
              }
            />
          </RowComponent>
        </View>

        {/* Ghi chú - giữ nguyên đoạn này */}
        <Text
          style={{
            color: appColors.gray4,
            fontSize: 12,
            marginBottom: 16,
          }}>
          By clicking “Recharge now”, you agree to the{' '}
          <Text
            style={{color: appColors.primary, textDecorationLine: 'underline'}}>
            Terms of Use
          </Text>{' '}
          and{' '}
          <Text
            style={{color: appColors.primary, textDecorationLine: 'underline'}}>
            Privacy Policy
          </Text>{' '}
          of EvenHub
        </Text>
      </View>
      <SectionComponent
        styles={{bottom: 0, position: 'absolute', right: 0, left: 0}}>
        <ButtonComponent
          disable={!amount || Number(amount) <= 0}
          text="Recharge now"
          onPress={() => {
            handleRecharge();
          }}
          type="primary"
        />
      </SectionComponent>
      <Modal
        visible={alertVisible}
        transparent={true}
        animationType="fade"
        statusBarTranslucent={true}
        onRequestClose={() => setAlertVisible(false)}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <View
            style={{
              width: '80%',
              backgroundColor: '#FFF',
              borderRadius: 16,
              padding: 25,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 4},
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}>
            <TextComponent
              font={fontFamilies.medium}
              size={18}
              text={alertMessage}
              color={done ? appColors.primary : appColors.danger}
              styles={{textAlign: 'center', marginBottom: 16}}
            />
            <SpaceComponent height={20} />
            <ButtonComponent
              onPress={() => {
                setAlertVisible(false);
                setAmount('');
                setSelectedAmount(null);
              }}
              width={80}
              styles={{paddingVertical: 10, marginBottom: 0}}
              color={appColors.primary}
              type="primary"
              textStyles={{flex: 0, fontSize: 16}}
              text="Close"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Recharge;
