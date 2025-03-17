import {LocationModelSuggest} from '../models/LocationModel';
import {ItemSelectVehicle} from '../models/SelectModel';

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

const itemSelectVehicle: ItemSelectVehicle[] = [
  {
    id: '1',
    image: require('../assets/images/bike.png'),
    name: 'Vivu Bike',
    type: 'Bike',
    numberSeat: 2,
    description: 'Fast, convenient',
    costCoefficient: 20,
    averageTime: 2.2,
  },

  {
    id: '2',
    image: require('../assets/images/car.png'),
    name: 'Vivu Car',
    type: 'Car',
    numberSeat: 4,
    description: 'Safe, clean',
    costCoefficient: 50,
    averageTime: 1.6,
  },
  {
    id: '4',
    image: require('../assets/images/bike.png'),
    name: 'Vivu Bike Plus',
    type: 'BikePlus',
    numberSeat: 2,
    description: 'Luxury experience',
    costCoefficient: 25,
    averageTime: 2,
  },
  {
    id: '3',
    image: require('../assets/images/car.png'),
    name: 'Vivu Car Family',
    type: 'CarFamily',
    numberSeat: 7,
    description: 'Spacious space',
    costCoefficient: 80,
    averageTime: 1.6,
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
    image: require('../assets/images/bike-white.png'),
    title: 'Bike',
    type: 'bike',
  },
  {
    id: '2',
    image: require('../assets/images/car-white.png'),
    title: 'Taxi',
    type: 'taxi',
  },
  {
    id: '3',
    image: require('../assets/images/delivery.png'),
    title: 'Delivery',
    type: 'delivery',
  },
  {
    id: '4',
    image: require('../assets/images/car-black.png'),
    title: 'Airport car',
    type: 'taxi',
  },
];

export default {locationsDataFake, itemBookingHomeData, itemSelectVehicle};
