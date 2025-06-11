import axiosClient from './axiosClient';

export const rechargeBalanceAndNotify = (data: {
  cost: number;
  driverId: string;
}) =>
  axiosClient({
    url: '/stripe/recharge-user',
    method: 'post',
    data,
  });
