import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BACKEND_URL = "http://localhost:8080";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/auth/login`,
        userData,
        {withCredentials:true}
       
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);


export const updateUserProfileThunk = createAsyncThunk(
  "users/updateUser",
  async ({ userId, data }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${BACKEND_URL}/user/update-profile/${userId}`,
        data,
        {withCredentials:true}
      );

      return res.data.user;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update user"
      );
    }
  }
);

