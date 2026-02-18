import { createSlice } from "@reduxjs/toolkit";
import {
  getUsers,
  getDashboardOverview,
} from "./userThunks";

const initialState = {
  pagination: null,
  dashboard: null,

  loading: false,
  updating: false,
  dashboardLoading: false,

  error: null,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
    
      .addCase(getDashboardOverview.pending, (state) => {
        state.dashboardLoading = true;
        state.error = null;
      })
      .addCase(getDashboardOverview.fulfilled, (state, action) => {
        state.dashboardLoading = false;
        state.dashboard = action.payload;
      })
      .addCase(getDashboardOverview.rejected, (state, action) => {
        state.dashboardLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearUserError } = userSlice.actions;
export default userSlice.reducer;
