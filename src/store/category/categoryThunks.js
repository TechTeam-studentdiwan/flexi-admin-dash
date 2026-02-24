import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {BACKEND_URL} from "../url"

// ================= GET =================
export const getCategories = createAsyncThunk(
  "category/getCategories",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BACKEND_URL}/categories/getcatagories`, {
        withCredentials: true,
      });
      return res.data.categories;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch categories"
      );
    }
  }
);

// ================= ADD =================
export const addCategory = createAsyncThunk(
  "category/addCategory",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BACKEND_URL}/categories/add`, data, {
        withCredentials: true,
      });
      return res.data.category;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to add category"
      );
    }
  }
);

// ================= UPDATE =================
export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${BACKEND_URL}/categories/update/${id}`,
        data,
        { withCredentials: true }
      );
      return res.data.category;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update category"
      );
    }
  }
);

// ================= DELETE =================
export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${BACKEND_URL}/categories/delete/${id}`, {
        withCredentials: true,
      });
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete category"
      );
    }
  }
);
