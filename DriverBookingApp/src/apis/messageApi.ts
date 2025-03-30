import axiosClient from './axiosClient';

export const apiGetAllRoomChat = () =>
  axiosClient({
    url: '/room-chat/get-all-room-chat-driver',
    method: 'get',
  });

export const apiGetRoomChat = (data: {roomId: string}) =>
  axiosClient({
    url: '/room-chat/get-room-chat-by-id',
    method: 'post',
    data,
  });
