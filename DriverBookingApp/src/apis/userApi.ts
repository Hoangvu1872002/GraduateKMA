import axiosClient from './axiosClient';

export const apiGetUserById = (data: {_id: string}) =>
  axiosClient({
    url: '/user/get-user-by-id',
    method: 'post',
    data,
  });
