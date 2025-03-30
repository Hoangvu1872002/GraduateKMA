import {LocationModelSuggest} from './LocationModel';

export interface SelectModel {
  label: string;
  value: string;
}

export interface ItemSelectVehicle {
  id: string;
  image: string;
  name: string;
  type: string;
  numberSeat: number;
  description: string;
  costCoefficient: number;
  averageTime: number;
}

// export interface ItemSelectOrder {
//   addressSelectedPickup: LocationModelSuggest;
//   addressSelectedDestination: LocationModelSuggest;
//   totalDistance: number;
//   typeVehicleSelected: number;
//   costVehicleSelected: number;
//   averageTimeVehicleSelected: number;
//   infCustomer: any;
// }

export interface ILocation {
  main_name_place: string;
  description?: string;
  latitude: number;
  longitude: number;
}

export interface ICustomer {
  _id: string;
  firstname: string;
  lastname: string;
  mobile: string;
  email: string;
  socketId: string;
}

export interface IBillTemporary {
  _id: string;
  pickupAddress: ILocation;
  destinationAddress: ILocation;
  distanceInKilometers: number;
  durationInMinutes: number;
  paymentMethod?: string;
  travelMode: string;
  cost: number;
  userId: string;
  socketIdDriversReceived: string[];
  createdAt: string;
  updatedAt: string;
  infCustomer: ICustomer;
}
