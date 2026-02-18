import { createSlice } from "@reduxjs/toolkit";
import { loginUser, updateUserProfileThunk } from "./authThunks";

const initialState = {
  user: null,
  loading: false,
  updating: false,
  error: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },

    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE PROFILE (FIXED)
      .addCase(updateUserProfileThunk.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateUserProfileThunk.fulfilled, (state, action) => {
        state.updating = false;

        // 🔥 THIS IS THE FIX
        state.user = action.payload;
      })
      .addCase(updateUserProfileThunk.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, logoutUser } = authSlice.actions;
export default authSlice.reducer;
