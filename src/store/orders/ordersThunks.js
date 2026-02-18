import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "https://flexiibackend.up.railway.app/orders"; // change if needed

// 🔹 Get All Orders (Admin)
export const getAllOrders = createAsyncThunk(
  "orders/getAllOrders",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/getallorders`, {
        params, // sends query params automatically
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
        `${BASE_URL}/update/${orderId}`,
        updateData,
        {
          withCredentials: true, // if you use cookies auth
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