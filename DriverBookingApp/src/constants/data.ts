import {LocationModelSuggest} from '../models/LocationModel';

const locationsDataFake: LocationModelSuggest[] = [
  {
    place_id: '1',
    description: 'Quận Hoàn Kiếm, Hà Nội, Việt Nam',
    main_name_place: 'Hoàn Kiếm Lake',
    latitude: 21.028511,
    longitude: 105.854444,
  },
  {
    place_id: '2',
    description: '58 Quốc Tử Giám, Văn Miếu, Đống Đa, Hà Nội, Việt Nam',
    main_name_place: 'Temple of Literature',
    latitude: 21.02774,
    longitude: 105.835085,
  },
  {
    place_id: '3',
    description: '191 Bà Triệu, Hai Bà Trưng, Hà Nội, Việt Nam',
    main_name_place: 'Vincom Center Ba Trieu',
    latitude: 21.027378,
    longitude: 105.858426,
  },
  {
    place_id: '4',
    description: 'Tây Hồ, Hà Nội, Việt Nam',
    main_name_place: 'West Lake',
    latitude: 21.070207,
    longitude: 105.854444,
  },
  {
    place_id: '5',
    description: '213 Đường Láng, Đống Đa, Hà Nội, Việt Nam',
    main_name_place: 'Thu Le Park',
    latitude: 21.036604,
    longitude: 105.803825,
  },
  {
    place_id: '6',
    description: 'Quận Hoàn Kiếm, Hà Nội, Việt Nam',
    main_name_place: 'Old Quarter',
    latitude: 21.033888,
    longitude: 105.850558,
  },
  {
    place_id: '7',
    description: '27 Cổ Linh, Long Biên, Hà Nội, Việt Nam',
    main_name_place: 'Aeon Mall Long Bien',
    latitude: 21.065729,
    longitude: 105.883975,
  },
  {
    place_id: '8',
    description: '1 Hoả Lò, Trần Hưng Đạo, Hoàn Kiếm, Hà Nội, Việt Nam',
    main_name_place: 'Hoa Lo Prison',
    latitude: 21.02211,
    longitude: 105.855081,
  },
  {
    place_id: '9',
    description: 'Ba Đình, Hà Nội, Việt Nam',
    main_name_place: 'Ba Dinh Square',
    latitude: 21.027562,
    longitude: 105.832519,
  },
  {
    place_id: '10',
    description: '66 Nguyễn Thái Học, Quốc Tử Giám, Đống Đa, Hà Nội, Việt Nam',
    main_name_place: 'Vietnam Fine Arts Museum',
    latitude: 21.027858,
    longitude: 105.833199,
  },
  {
    place_id: '11',
    description: 'Ciputra, Tây Hồ, Hà Nội, Việt Nam',
    main_name_place: 'Ciputra Hanoi',
    latitude: 21.04876,
    longitude: 105.826091,
  },
];

const itemSelectVehicle: {
  id: string;
  image: string;
  name: string;
  type: string;
  numberSeat: number;
  description: string;
  costCoefficient: number;
}[] = [
  {
    id: '1',
    image: require('../assets/images/bike.png'),
    name: 'Vivu Bike',
    type: 'Bike',
    numberSeat: 2,
    description: 'Fast, convenient',
    costCoefficient: 0.4,
  },

  {
    id: '2',
    image: require('../assets/images/car.png'),
    name: 'Vivu Car',
    type: 'Car',
    numberSeat: 4,
    description: 'Safe, clean',
    costCoefficient: 0.7,
  },
  {
    id: '4',
    image: require('../assets/images/bike.png'),
    name: 'Vivu Bike Plus',
    type: 'BikePlus',
    numberSeat: 2,
    description: 'Luxury experience',
    costCoefficient: 0.5,
  },
  {
    id: '3',
    image: require('../assets/images/car.png'),
    name: 'Vivu Car Family',
    type: 'CarFamily',
    numberSeat: 7,
    description: 'Spacious space',
    costCoefficient: 0.9,
  },
];

const itemBookingHomeData: {
  id: string;
  image: string;
  title: string;
  type: string;
}[] = [
  {
    id: '1',
    image: require('../assets/images/banner_bike_fare_calcualtion_info.png'),
    title: 'Bike',
    type: 'bike',
  },
  {
    id: '2',
    image: require('../assets/images/banner_taxi_fare_calcualtion_info.png'),
    title: 'Taxi',
    type: 'taxi',
  },
];

export default {locationsDataFake, itemBookingHomeData, itemSelectVehicle};
