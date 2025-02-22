import axiosClient from './axiosClient';

// export const apiGetCurrent = () =>
//   axiosClient({
//     url: '/user/current',
//     method: 'get',
//   });

export const apiUpdateLocationDriver = (data: {
  longitude: number;
  latitude: number;
}) =>
  axiosClient({
    url: '/driver/update-location-driver',
    method: 'put',
    data,
  });
