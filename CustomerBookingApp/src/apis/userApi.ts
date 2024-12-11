import axiosClient from './axiosClient';

export const apiGetCurrent = () =>
  axiosClient({
    url: '/user/current',
    method: 'get',
  });
