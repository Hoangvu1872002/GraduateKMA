import axiosClient from './axiosClient';

export const apiCreateEvent = (data: any) =>
  axiosClient({
    url: '/event/create-event',
    method: 'post',
    data,
  });

export const apiGetEventLastest = () =>
  axiosClient({
    url: '/event/get-event-lastest',
    method: 'get',
  });
