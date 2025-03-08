import axiosClient from './axiosClient';

export const apiUpdateStatusBill = (data: {billId: string; status: string}) =>
  axiosClient({
    url: 'bill/update-bills-status',
    method: 'put',
    data,
  });
