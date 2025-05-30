import axiosClient from './axiosClient';

export const apiUpdateStatusBill = (data: {billId: string; status: string}) =>
  axiosClient({
    url: 'bill/update-bills-status',
    method: 'put',
    data,
  });

export const apiAllBillDriver = () =>
  axiosClient({
    url: '/bill/get-all-bill-driver',
    method: 'get',
  });

export const apiGetBill = (data: {billId: string}) =>
  axiosClient({
    url: '/bill/get-bill',
    method: 'post',
    data,
  });
