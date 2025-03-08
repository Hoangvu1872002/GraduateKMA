import axiosClient from './axiosClient';

export const apiGetBillsPending = () =>
  axiosClient({
    url: '/bill/get-bills-pending',
    method: 'get',
  });
