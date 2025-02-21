import {io, Socket} from 'socket.io-client';
import {appInfo} from '../constants/appInfos';

const SERVER_URL = `${appInfo.BASE_URL}/booking`;
const socket: Socket = io(SERVER_URL, {
  transports: ['websocket'], // Sử dụng WebSocket để tránh lỗi polling
  forceNew: false, // Giữ kết nối nếu có thể
  reconnectionAttempts: 5, // Số lần thử kết nối lại nếu mất kết nối
  timeout: 10000, // Timeout kết nối 10s
});

socket.on('connect', () => {
  console.log('✅ Connected to server:', socket.id);
});

socket.on('connect_error', err => {
  console.error('❌ Socket connection error:', err.message);
});

export default socket;
