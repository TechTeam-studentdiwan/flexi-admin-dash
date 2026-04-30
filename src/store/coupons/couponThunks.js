import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {BACKEND_URL} from "../url"

export const getCoupons = createAsyncThunk(
  "coupon/getCoupons",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BACKEND_URL}/coupons/get-coupons`, {
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
      const res = await axios.post(`${BACKEND_URL}/coupons/create`, data, {
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
      const res = await axios.put(`${BACKEND_URL}/coupons/update/${id}`, data, {
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
      await axios.delete(`${BACKEND_URL}/coupons/delete/${id}`, {
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

// GET all assigned vouchers (admin)
export const getAssignedVouchers = createAsyncThunk(
  "coupon/getAssignedVouchers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BACKEND_URL}/coupons/assigned-all`, {
        withCredentials: true,
      });
      return res.data.vouchers;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch assigned vouchers"
      );
    }
  }
);

// ASSIGN personal voucher to a user
export const assignVoucher = createAsyncThunk(
  "coupon/assignVoucher",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BACKEND_URL}/coupons/assign`, data, {
        withCredentials: true,
      });
      return res.data.voucher;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Assign failed"
      );
    }
  }
);

// VALIDATE
export const validateCoupon = createAsyncThunk(
  "coupon/validateCoupon",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BACKEND_URL}/coupons/validate`, data, {
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
