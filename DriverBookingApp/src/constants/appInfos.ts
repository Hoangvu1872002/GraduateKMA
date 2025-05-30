import {Dimensions} from 'react-native';

export const appInfo = {
  sizes: {
    WIDTH: Dimensions.get('window').width,
    HEIGHT: Dimensions.get('window').height,
  },
  // BASE_URL: 'http://192.168.68.206:5002',
  BASE_URL: 'http://192.168.1.39:5002',
  GoogleApiKey: 'AIzaSyCbtwJ3e1wGs0RcFkgQPtaLwg0P4XxkELA',
  monthNames: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  dayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
};
