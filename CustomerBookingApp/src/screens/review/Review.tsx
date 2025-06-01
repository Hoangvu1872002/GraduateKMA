import {
  View,
  Text,
  StatusBar,
  Platform,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {globalStyles} from '../../styles/globalStyles';
import {appColors} from '../../constants/appColors';
import {RowComponent, TextComponent, ButtonComponent} from '../../components';
import {fontFamilies} from '../../constants/fontFamilies';
import {Star1} from 'iconsax-react-native';
import {apiRatingDriver} from '../../apis';
import Toast from 'react-native-toast-message';

const compliments = [
  'Friendly',
  'Careful',
  'On time',
  'Good attitude',
  'Neat uniform',
  'Clean',
];

const Review = ({navigation, route}: any) => {
  const {data}: {data: any} = route?.params || {};

  const [rating, setRating] = useState(5);
  const [selectedCompliments, setSelectedCompliments] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [userComment, setUserComment] = useState('');

  const driver = {
    name: `${data?.driverId?.firstname} ${data?.driverId?.lastname}`,
    avatar: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
  };

  const handleSelectCompliment = (item: string) => {
    setSelectedCompliments(prev =>
      prev.includes(item) ? prev.filter(c => c !== item) : [...prev, item],
    );
  };

  const handleSubmit = async () => {
    const rs = await apiRatingDriver({
      driverId: data?.driverId?._id,
      star: rating,
      comment,
    });
    if (rs.data.success) {
      Toast.show({
        type: 'success',
        text1: 'Success!',
        autoHide: true,
        text2: 'Ratinrg driver successfully',
        visibilityTime: 2000,
      });
      setTimeout(() => {
        navigation.replace('Main');
      }, 500);
    } else {
      Alert.alert('Error');
    }
  };

  useEffect(() => {
    if (selectedCompliments.length > 0) {
      setComment(
        selectedCompliments.join(', ') +
          (userComment ? '\n' + userComment : ''),
      );
    } else {
      setComment(userComment);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCompliments, userComment]);

  return (
    <KeyboardAvoidingView
      style={{flex: 1, backgroundColor: appColors.gray6}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View
          style={[
            globalStyles.container,
            {flex: 1, backgroundColor: appColors.gray6},
          ]}>
          <StatusBar barStyle={'light-content'} />
          {/* Header giữ nguyên */}
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
                text="Review driver"
                font={fontFamilies.bold}
                color={appColors.WhiteSmoke}
              />
            </View>
          </View>
          {/* Avatar & Name */}
          <View style={{alignItems: 'center', marginTop: 24}}>
            <Image
              source={{uri: driver.avatar}}
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                marginBottom: 8,
                borderWidth: 2,
                borderColor: appColors.primary,
              }}
            />
            <TextComponent
              text={driver.name}
              font={fontFamilies.semiBold}
              size={18}
              styles={{marginBottom: 4}}
            />
            <RowComponent justify="center" styles={{marginBottom: 4}}>
              {[1, 2, 3, 4, 5].map(i => (
                <TouchableOpacity key={i} onPress={() => setRating(i)}>
                  <Star1
                    size={28}
                    variant="Bold"
                    color={i <= rating ? '#FFD600' : appColors.gray3}
                  />
                </TouchableOpacity>
              ))}
            </RowComponent>
            <TextComponent
              text={
                rating === 5
                  ? 'Excellent'
                  : rating === 4
                  ? 'Very good'
                  : rating === 3
                  ? 'Good'
                  : rating === 2
                  ? 'Average'
                  : 'Poor'
              }
              color={appColors.gray4}
              size={14}
              styles={{marginBottom: 8}}
            />
          </View>
          {/* Compliments */}
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 16,
              borderWidth: 1,
              borderColor: appColors.gray3,
              padding: 16,
              marginHorizontal: 16,
              marginBottom: 16,
              marginTop: 8,
            }}>
            <TextComponent
              text="Send your compliments"
              font={fontFamilies.medium}
              size={15}
              styles={{marginBottom: 12}}
            />
            <RowComponent justify="flex-start" styles={{flexWrap: 'wrap'}}>
              {compliments.map(item => (
                <TouchableOpacity
                  key={item}
                  onPress={() => handleSelectCompliment(item)}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 20,
                    backgroundColor: selectedCompliments.includes(item)
                      ? appColors.primary
                      : '#F7F7F9',
                    borderWidth: 1,
                    borderColor: selectedCompliments.includes(item)
                      ? appColors.primary
                      : appColors.gray3,
                    marginRight: 8,
                    marginBottom: 8,
                  }}>
                  <TextComponent
                    color={
                      selectedCompliments.includes(item)
                        ? '#fff'
                        : appColors.text
                    }
                    text={item}
                    size={14}
                  />
                </TouchableOpacity>
              ))}
            </RowComponent>
          </View>
          {/* Comment */}
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 16,
              borderWidth: 1,
              borderColor: appColors.gray3,
              padding: 16,
              marginHorizontal: 16,
              marginBottom: 16,
            }}>
            <TextInput
              value={userComment}
              onChangeText={setUserComment}
              placeholder="Anything you want to share? Your review and comment will be displayed anonymously."
              multiline
              style={{
                minHeight: 60,
                fontSize: 15,
                color: appColors.text,
                textAlignVertical: 'top',
              }}
            />
            <TextComponent
              text={
                selectedCompliments.length > 0
                  ? selectedCompliments.join(', ')
                  : ''
              }
              color={appColors.primary}
              size={14}
              styles={{marginBottom: 4}}
            />
          </View>
          {/* Submit button */}
          <View style={{marginHorizontal: 16, marginBottom: 24}}>
            <ButtonComponent
              text="Submit"
              type="primary"
              color={appColors.primary}
              onPress={handleSubmit}
              styles={{borderRadius: 12, paddingVertical: 14}}
              textStyles={{fontSize: 17}}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Review;
