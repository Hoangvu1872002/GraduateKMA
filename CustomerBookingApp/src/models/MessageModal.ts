export interface IMessageClient {
  id?: string;
  sender: string;
  message: string;
  isRead?: boolean;
  createdAt?: any;
}

interface IInfo {
  _id: string;
  firstname: string;
  lastname: string;
  mobile?: string;
  licensePlate?: string;
}

export interface IRoomChatClient {
  _id: string;
  user: IInfo;
  driver: IInfo;
  listMessages: IMessageClient[];
  lastestMesage: IMessageClient;
  createdAt: string;
  updatedAt: string;
}
