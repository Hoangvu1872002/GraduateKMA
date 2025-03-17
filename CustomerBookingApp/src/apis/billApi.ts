import axiosClient from './axiosClient';

export const apiGetBillsPending = () =>
  axiosClient({
    url: '/bill/get-bills-pending',
    method: 'get',
  });

export const apiGetBill = (data: {billId: string}) =>
  axiosClient({
    url: '/bill/get-bill',
    method: 'post',
    data,
  });

export const apiAllBill = () =>
  axiosClient({
    url: '/bill/get-all-bill',
    method: 'get',
  });
