import {createSlice} from '@reduxjs/toolkit';
import * as actions from './asyncAction';
import {IBill} from '../../models/BillModel';

export const userSlide = createSlice({
  name: 'user',
  initialState: {
    isLoggedIn: false,
    current: null,
    token: null,
    isLoading: false,

    listOrderPending: [] as IBill[],
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
    // addToListOrderpending: (state, action) => {
    //   console.log(state.listOrderPending);

    //   state.listOrderPending = [...state.listOrderPending, action.payload];
    // },
    // removeFromListOrderPending: (state, action) => {
    //   state.listOrderPending = state.listOrderPending.filter(
    //     item => item._id !== action.payload.billId,
    //   );
    // },
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
  // addToListOrderpending,
  // removeFromListOrderPending,
} = userSlide.actions;

export default userSlide.reducer;
