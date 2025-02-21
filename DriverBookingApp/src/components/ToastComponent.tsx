import {View, Text} from 'react-native';
import React from 'react';
import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';

const ToastComponent = () => {
  const toastConfig = {
    success: (props: any) => (
      <BaseToast
        {...props}
        style={{borderLeftColor: 'green', width: '95%'}}
        contentContainerStyle={{paddingHorizontal: 15}}
        text1Style={{
          fontSize: 17,
        }}
        text2Style={{
          fontSize: 15,
        }}
      />
    ),

    error: (props: any) => (
      <ErrorToast
        {...props}
        style={{borderLeftColor: 'red', width: '95%'}}
        contentContainerStyle={{paddingHorizontal: 20}}
        text1Style={{
          fontSize: 17,
        }}
        text2Style={{
          fontSize: 15,
        }}
      />
    ),

    // tomatoToast: ({ text1, props }) => (
    //   <View style={{ height: 60, width: '100%', backgroundColor: 'tomato' }}>
    //     <Text>{text1}</Text>
    //     <Text>{props.uuid}</Text>
    //   </View>
    // )
  };
  return (
    <>
      <Toast config={toastConfig} />
    </>
  );
};

export default ToastComponent;
