import { createSlice } from "@reduxjs/toolkit";
import {
  getOffers,
  createOffer,
  updateOffer,
  deleteOffer,
} from "./offerThunks";

const offerSlice = createSlice({
  name: "offers",
  initialState: {
    offers: [],
    loading: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOffers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOffers.fulfilled, (state, action) => {
        state.loading = false;
        state.offers = action.payload;
      })
      .addCase(createOffer.fulfilled, (state, action) => {
        state.offers.unshift(action.payload);
      })
      .addCase(updateOffer.fulfilled, (state, action) => {
        const index = state.offers.findIndex(
          (o) => o._id === action.payload._id
        );
        if (index !== -1) state.offers[index] = action.payload;
      })
      .addCase(deleteOffer.fulfilled, (state, action) => {
        state.offers = state.offers.filter(
          (o) => o._id !== action.payload
        );
      });
  },
});

export default offerSlice.reducer;
