import axiosClient from './axiosClient';

export const apiUpdateSocketId = (data: {socketId: string | null}) =>
  axiosClient({
    url: '/driver/update-driver-socketId',
    method: 'put',
    data,
  });

export const apiUpdateLocationDriver = (data: {
  longitude: number;
  latitude: number;
}) =>
  axiosClient({
    url: '/driver/update-location-driver',
    method: 'put',
    data,
  });

export const apiGetCurrent = () =>
  axiosClient({
    url: '/driver/current',
    method: 'get',
  });
