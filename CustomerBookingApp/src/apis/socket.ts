import {io, Socket} from 'socket.io-client';
import {appInfo} from '../constants/appInfos';
import {apiUpdateSocketId} from './userApi';
import {store} from '../stores/redux';
import {getCurrent} from '../stores/users/asyncAction';

const SERVER_URL = `${appInfo.BASE_URL}/booking`;
const socket: Socket = io(SERVER_URL, {
  transports: ['websocket'], // Sử dụng WebSocket để tránh lỗi polling
  forceNew: false, // Giữ kết nối nếu có thể
  reconnectionAttempts: 5, // Số lần thử kết nối lại nếu mất kết nối
  timeout: 10000, // Timeout kết nối 10s
});

socket.on('connect', async () => {
  console.log('✅ Connected to server:', socket.id);

  if (socket.id) {
    await apiUpdateSocketId({socketId: socket.id});
    store.dispatch(getCurrent());
  }
});

socket.on('connect_error', err => {
  console.error('❌ Socket connection error:', err.message);
});

export default socket;
