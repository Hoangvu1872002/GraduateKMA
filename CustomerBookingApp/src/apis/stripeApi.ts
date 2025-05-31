import axiosClient from './axiosClient';

export const apiPay = (data: {cost: number}) =>
  axiosClient({
    url: '/stripe/pay',
    method: 'post',
    data,
  });
