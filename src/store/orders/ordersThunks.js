import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {BACKEND_URL} from "../url"

export const getAllOrders = createAsyncThunk(
  "orders/getAllOrders",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/orders/getallorders`, {
        params, 
        withCredentials: true,
      });

      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch orders"
      );
    }
  }
);


export const updateOrderByAdminThunk = createAsyncThunk(
  "orders/updateOrderByAdmin",
  async ({ orderId, updateData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/orders/update/${orderId}`,
        updateData,
        {
          withCredentials: true, 
        }
      );

      return response.data.order;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update order"
      );
    }
  }
);