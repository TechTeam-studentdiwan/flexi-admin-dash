import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:8080/user";

export const getUsers = createAsyncThunk(
  "users/getUsers",
  async (params, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 10, search = "", isAdmin } = params || {};

      const query = new URLSearchParams({
        page,
        limit,
        search,
        ...(isAdmin !== undefined && { isAdmin }),
      }).toString();

      const res = await axios.get(`${BASE_URL}/get-users?${query}`,{withCredentials:true});

      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

export const updateUserProfileThunk = createAsyncThunk(
  "users/updateUser",
  async ({ userId, data }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${BASE_URL}/update-profile/${userId}`,
        data
      );

      return res.data.user;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update user"
      );
    }
  }
);

export const getDashboardOverview = createAsyncThunk(
  "users/getDashboardOverview",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/get-dashboard-overview`,{withCredentials:true}
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load dashboard"
      );
    }
  }
);
