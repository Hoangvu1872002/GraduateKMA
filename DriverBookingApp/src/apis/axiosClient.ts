import {appInfo} from './../constants/appInfos';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tạo instance của axios
const instance = axios.create({
  baseURL: appInfo.BASE_URL, // Thay đổi baseURL theo server của bạn
});

// Thêm một bộ đón chặn request
instance.interceptors.request.use(
  async (config: any) => {
    try {
      // Lấy dữ liệu token từ AsyncStorage
      const localStorageData = await AsyncStorage.getItem(
        'persist:booking/user',
      );

      if (localStorageData) {
        const parsedData = JSON.parse(localStorageData);
        const accessToken = parsedData?.token;
        // console.log(accessToken);
        if (accessToken) {
          // Gắn token vào header
          config.headers = {
            authorization: `Bearer ${accessToken.slice(1, -1)}`,
          };
        }
      }
      return config;
    } catch (error) {
      console.error('Error fetching token:', error);
      return config;
    }
  },
  error => {
    // Xử lý lỗi trong request
    return Promise.reject(error);
  },
);

// Thêm một bộ đón chặn response
instance.interceptors.response.use(
  response => {
    // Xử lý thành công, trả về dữ liệu từ server
    return response.data;
  },
  error => {
    // Xử lý lỗi từ server
    return Promise.reject(error.response?.data || error.message);
  },
);

export default instance;
