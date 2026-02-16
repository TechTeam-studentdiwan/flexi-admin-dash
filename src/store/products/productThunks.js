import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:8080/products";

export const getProducts = createAsyncThunk(
  "product/getProducts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/get-products`, {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/update/${id}`,
        data,
        { withCredentials: true }
      );

      return response.data.product;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Update failed"
      );
    }
  }
);

export const addProduct = createAsyncThunk(
  "product/addProduct",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}/add`, data, {
        withCredentials: true,
      });
      return res.data.product;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to add product"
      );
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/delete/${id}`, {
        withCredentials: true,
      });
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete product"
      );
    }
  }
);
