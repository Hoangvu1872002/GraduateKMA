import {createAsyncThunk} from '@reduxjs/toolkit';
import {apiGetCurrent} from '../../apis';

// import * as apis from "../../apis/userApi";

export const getCurrent = createAsyncThunk(
  'user/curnent',
  async (data, {rejectWithValue}) => {
    const response = await apiGetCurrent();

    if (!response.data.success) return rejectWithValue(response);

    return response.data.rs;
  },
);
