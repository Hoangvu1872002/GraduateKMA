import {createSlice} from '@reduxjs/toolkit';
import * as actions from './asyncAction';
import socket from '../../apis/socket';
import {IBillTemporary} from '../../models/SelectModel';
import {IBill} from '../../models/BillModel';

interface Coordinates {
  latitude: number;
  longitude: number;
}

export const userSlide = createSlice({
  name: 'user',
  initialState: {
    isLoggedIn: false,
    current: null,
    token: null,
    isLoading: false,
    mes: '',
    currentLocation: {
      latitude: 0,
      longitude: 0,
    } as Coordinates,
    listOrderReceived: [] as IBillTemporary[],
    orderPending: {} as IBill,
  },
  reducers: {
    login: (state, action) => {
      // console.log(action);

      state.isLoggedIn = action.payload.isLoggedIn;
      state.token = action.payload.token;
    },
    logout: (state, action) => {
      state.isLoggedIn = false;
      state.current = null;
      state.token = null;
      state.isLoading = false;
      //   state.mes = "";
      //   state.currentCart = null
    },
    clearMessage: state => {
      //   state.mes = "";
    },
    setCurrentLocation: (state, action) => {
      state.currentLocation = action.payload;
      if (state.orderPending && Object.keys(state.orderPending).length !== 0) {
        socket.emit('send-location-to-customer', {
          idOrder: state.orderPending._id,
          locationDriver: action.payload,
        });
      }
      // console.log('Updated currentLocation:', state.currentLocation);
    },
    addToListOrderReceived: (state, action) => {
      state.listOrderReceived = [...state.listOrderReceived, action.payload];
    },
    removeFromListOrderReceived: (state, action) => {
      state.listOrderReceived = state.listOrderReceived.filter(
        item => item._id !== action.payload,
      );
    },
    clearListOrderReceived: (state, action) => {
      state.listOrderReceived = [];
      console.log('Cleared listOrderReceived:');
    },
    setOrderPending: (state, action) => {
      state.orderPending = action.payload;
    },
  },

  extraReducers: builder => {
    builder.addCase(actions.getCurrent.pending, state => {
      console.log('1');

      state.isLoading = true;
    });

    builder.addCase(actions.getCurrent.fulfilled, (state, action) => {
      console.log('2');

      state.isLoading = false;
      //   state.currentCart = action.payload.cart;
      state.current = action.payload;
      state.isLoggedIn = true;
      // console.log(state.current);
    });

    builder.addCase(actions.getCurrent.rejected, (state, action) => {
      console.log('3');

      // state.isLoading = false;
      // state.current = null;
      // state.isLoggedIn = false;
      // state.token = null;
      // //   state.currentCart = null;
      // state.mes = 'Login session has expired. Please log in again!';
    });
  },
});

export const {
  login,
  logout,
  clearMessage,
  setCurrentLocation,
  addToListOrderReceived,
  removeFromListOrderReceived,
  setOrderPending,
  clearListOrderReceived,
} = userSlide.actions;

export default userSlide.reducer;
