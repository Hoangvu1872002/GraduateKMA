import axiosClient from './axiosClient';

export const apiGetCurrent = () =>
  axiosClient({
    url: '/user/current',
    method: 'get',
  });

export const apiGetAllUsers = () =>
  axiosClient({
    url: '/user/get-all-users',
    method: 'get',
  });
