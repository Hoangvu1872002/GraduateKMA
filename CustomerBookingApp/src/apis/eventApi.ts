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

export const apiGetAllEvent = () =>
  axiosClient({
    url: '/event/get-all-event',
    method: 'get',
  });

export const apiDeleteEvent = (data: {eventId: string}) =>
  axiosClient({
    url: '/event/delete-event',
    method: 'delete',
    data,
  });
