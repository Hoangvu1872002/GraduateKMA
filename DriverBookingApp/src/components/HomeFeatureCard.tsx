import React from 'react';
import {TouchableOpacity, View, StyleSheet} from 'react-native';
import TextComponent from './TextComponent';
import {fontFamilies} from '../constants/fontFamilies';
import {appColors} from '../constants/appColors';

interface Props {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  color: string;
  iconCircleColor: string;
  subtitleColor: string;
  onPress: () => void;
}

const HomeFeatureCard = ({
  icon,
  title,
  subtitle,
  color,
  subtitleColor,
  iconCircleColor,
  onPress,
}: Props) => (
  <TouchableOpacity
    style={[styles.card, {backgroundColor: color}]}
    onPress={onPress}>
    <View
      style={{
        // backgroundColor: 'coral',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        width: '100%',
      }}>
      <View
        style={{
          backgroundColor: iconCircleColor,
          borderBottomLeftRadius: 10,
          borderTopRightRadius: 18,
          width: '45%',
          padding: 10,

          display: 'flex',
          alignItems: 'center',
        }}>
        <View style={styles.iconCircle}>{icon}</View>
      </View>
    </View>
    <View style={{width: '100%', paddingHorizontal: 16, marginTop: 20}}>
      <TextComponent text={title} font={fontFamilies.semiBold} size={18} />
      <TextComponent
        text={subtitle}
        size={14}
        color={subtitleColor}
        font="medium"
      />
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 18,
    paddingBottom: 20,
    minHeight: 120,
    marginHorizontal: 6,
    alignItems: 'center',
    elevation: 2,
  },
  iconCircle: {
    backgroundColor: '#fff',

    borderRadius: 24,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    // marginBottom: 16,
    elevation: 1,
  },
});

export default HomeFeatureCard;
