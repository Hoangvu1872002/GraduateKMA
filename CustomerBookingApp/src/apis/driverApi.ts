import axiosClient from './axiosClient';

export const apiGetAllDriverNearby = (data: {
  longitude: number;
  latitude: number;
}) =>
  axiosClient({
    url: '/driver/find-driver-nearby',
    method: 'post',
    data,
  });
