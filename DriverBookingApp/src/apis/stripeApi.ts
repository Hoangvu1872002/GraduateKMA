import axiosClient from './axiosClient';

export const apiRecharge = (data: {cost: number}) =>
  axiosClient({
    url: '/stripe/recharge',
    method: 'post',
    data,
  });
