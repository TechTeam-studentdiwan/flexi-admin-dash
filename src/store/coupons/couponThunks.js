import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "https://flexiibackend.up.railway.app/coupons";

export const getCoupons = createAsyncThunk(
  "coupon/getCoupons",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/get-coupons`, {
        withCredentials: true,
      });
      return res.data.coupons;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch coupons"
      );
    }
  }
);

// CREATE
export const createCoupon = createAsyncThunk(
  "coupon/createCoupon",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}/create`, data, {
        withCredentials: true,
      });
      return res.data.coupon;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Create failed"
      );
    }
  }
);

// UPDATE
export const updateCoupon = createAsyncThunk(
  "coupon/updateCoupon",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${BASE_URL}/update/${id}`, data, {
        withCredentials: true,
      });
      return res.data.coupon;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Update failed"
      );
    }
  }
);

// DELETE
export const deleteCoupon = createAsyncThunk(
  "coupon/deleteCoupon",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/delete/${id}`, {
        withCredentials: true,
      });
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Delete failed"
      );
    }
  }
);

// VALIDATE
export const validateCoupon = createAsyncThunk(
  "coupon/validateCoupon",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}/validate`, data, {
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Validation failed"
      );
    }
  }
);
