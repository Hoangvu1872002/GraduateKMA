import {View, Text, Button} from 'react-native';
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../stores/redux';
import {logout} from '../../stores/users/userSlide';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import {apiUpdateLocationDriver} from '../../apis';

const HomeScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {isLoggedIn, current} = useSelector((state: RootState) => state.user);

  const reverseGeoCode = async ({lat, long}: {lat: number; long: number}) => {
    // console.log(lat, long);

    const api = `https://rsapi.goong.io/Geocode?latlng=${lat},${long}&api_key=crMmofRW2lgZNiDMZtCUdYqHZfGZv1cVZ864e0CR`;

    try {
      const res = await axios.get(api);

      if (res && res.status === 200 && res.data.results[0]) {
        const items = res.data.results[0].address;
        console.log(items);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    Geolocation.getCurrentPosition(
      async (position: any) => {
        if (position.coords) {
          console.log(position.coords);

          await apiUpdateLocationDriver({
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
          });

          // reverseGeoCode({
          //   lat: position.coords.latitude,
          //   long: position.coords.longitude,
          // });
        }
      },
      (error: any) => {
        console.log(error);
      },
      // {maximumAge: 0, timeout: 30000, enableHighAccuracy: true},
      {},
    );
  }, []);

  // useEffect(() => {
  //   const watchId = Geolocation.watchPosition(
  //     position => {
  //       console.log(position.coords);
  //     },
  //     error => console.error('Lỗi lấy tọa độ:', error),
  //     {enableHighAccuracy: true, distanceFilter: 1, interval: 5000},
  //   );

  //   return () => Geolocation.clearWatch(watchId);
  // }, []);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Button title="Logout" onPress={() => dispatch(logout({}))}></Button>
    </View>
  );
};

export default HomeScreen;
