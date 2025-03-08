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

export const apiUpdateSocketId = (data: {socketId: string | null}) =>
  axiosClient({
    url: '/user/update-user-socketId',
    method: 'put',
    data,
  });
