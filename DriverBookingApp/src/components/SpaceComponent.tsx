import {View, Text, StyleProp, ViewStyle} from 'react-native';
import React from 'react';

interface Props {
  width?: number;
  height?: number;
  styles?: StyleProp<ViewStyle>;
}

const SpaceComponent = (props: Props) => {
  const {width, height, styles} = props;

  return (
    <View
      style={[
        {
          width,
          height,
        },
        styles,
      ]}
    />
  );
};

export default SpaceComponent;
