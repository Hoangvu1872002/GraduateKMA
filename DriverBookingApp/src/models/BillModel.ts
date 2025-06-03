export interface IAddress {
  main_name_place: string;
  description: string;
  latitude: number;
  longitude: number;
}

export interface IBill {
  _id?: string; // ID có thể có hoặc không (khi tạo mới thì chưa có)
  pickupAddress: IAddress;
  destinationAddress: IAddress;
  distanceInKilometers: number;
  durationInMinutes: number;
  paymentMethod?: string;
  cost: number;
  roomChatId?: string;
  travelMode: string;
  userId: any; // Mongoose ObjectId dưới dạng string
  driverId: any;
  status: 'RECEIVED' | 'PENDING' | 'COMPLETED' | 'CANCELED'; // Chỉ nhận giá trị này
  createdAt?: string; // Timestamp từ MongoDB (có thể không có khi tạo mới)
  updatedAt?: string;
}
