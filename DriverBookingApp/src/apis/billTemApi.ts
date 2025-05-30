import axiosClient from './axiosClient';

export const apiGetBillTem = (data: {billId: string}) =>
  axiosClient({
    url: '/bill-tem/get-bill',
    method: 'post',
    data,
  });
