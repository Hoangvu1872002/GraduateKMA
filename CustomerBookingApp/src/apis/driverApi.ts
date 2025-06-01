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

export const apiRatingDriver = (data: {
  driverId: string;
  star: number;
  comment: string;
}) =>
  axiosClient({
    url: '/driver/rating',
    method: 'post',
    data,
  });
