import { createSlice } from "@reduxjs/toolkit";
import {
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
} from "./couponThunks";

const couponSlice = createSlice({
  name: "coupon",
  initialState: {
    coupons: [],
    loading: false,
    error: null,
    validationResult: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCoupons.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = action.payload;
      })
      .addCase(getCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createCoupon.fulfilled, (state, action) => {
        state.coupons.unshift(action.payload);
      })

      .addCase(updateCoupon.fulfilled, (state, action) => {
        state.coupons = state.coupons.map((c) =>
          c._id === action.payload._id ? action.payload : c
        );
      })

      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.coupons = state.coupons.filter(
          (c) => c._id !== action.payload
        );
      })

      .addCase(validateCoupon.fulfilled, (state, action) => {
        state.validationResult = action.payload;
      });
  },
});

export default couponSlice.reducer;
