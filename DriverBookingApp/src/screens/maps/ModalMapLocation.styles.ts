import {StyleSheet} from 'react-native';
import {appColors} from '../../constants/appColors';

export const styles = StyleSheet.create({
  markerFixed: {
    position: 'absolute',
    top: '50%', // Đặt vào giữa theo chiều dọc
    left: '50%', // Đặt vào giữa theo chiều ngang
    transform: [
      {translateX: -27}, // Điều chỉnh lại theo chiều ngang cho chính xác
      {translateY: -48}, // Điều chỉnh lại theo chiều dọc cho chính xác
    ],
    zIndex: 10, // Đảm bảo marker luôn hiển thị trên cùng
  },
  linearGradient: {
    height: 13,
    width: '100%',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  frame: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    width: '100%',
    height: 59,
    alignItems: 'center',
    zIndex: 11,
    pointerEvents: 'none',
  },
  buttonBack: {
    borderRadius: 100,
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  frameChild: {
    width: '93%',
    height: 59,
    borderColor: appColors.BlueDarkTurquoise,
    borderWidth: 0.8,
    borderRadius: 12,
    pointerEvents: 'none',
  },
  frameChild2: {
    width: '91%',
    height: 52,
    borderColor: appColors.BlueDarkTurquoise,
    borderWidth: 1.5,
    borderRadius: 12,
    pointerEvents: 'none',
  },
  frameButton: {
    height: '28%',
    // height: 80,
    justifyContent: 'center',
    paddingTop: 7,
    zIndex: 10,
    backgroundColor: appColors.WhiteSmoke,
    // backgroundColor: 'white',
  },
  frameButton2: {
    borderTopColor: appColors.gray2,
    borderTopWidth: 0.8,
    // height: '35%',
    flex: 1,
    // height: 80,
    // justifyContent: 'center',
    paddingTop: 7,
    zIndex: 10,
    backgroundColor: appColors.WhiteSmoke,
    // backgroundColor: 'coral',
  },
  titleFrameChoiceLocation: {
    justifyContent: 'center',
    backgroundColor: appColors.WhiteSmoke,
    alignItems: 'center',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    flex: 1,
    marginHorizontal: 20,
    height: '20%',
    // height: 55,
    borderBottomWidth: 0.5,
    borderColor: '#696969',
  },
  heighFrameChoiceLocation: {
    position: 'absolute',
    left: 0,
    height: '33%',
    right: 0,
    bottom: 0,
  },
  heighFrameChoiceLocation2: {
    position: 'absolute',
    left: 0,
    height: '38%',
    right: 0,
    bottom: 0,
  },
  marker: {
    width: 18,
    height: 18,

    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#98F5FF',
    shadowColor: '#000', // Màu của bóng
    shadowOffset: {
      width: 0,
      height: 4, // Hướng của bóng
    },
    shadowOpacity: 0.3, // Độ mờ của bóng
    shadowRadius: 4, // Độ lan của bóng
    elevation: 6, // Tạo bóng trên Android
  },
});
