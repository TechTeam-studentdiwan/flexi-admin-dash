import { createSlice } from "@reduxjs/toolkit";
import {
  getProducts,
  addProduct,
  deleteProduct,
} from "./productThunks";

const initialState = {
  products: [],
  total: 0,
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // GET
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.total = action.payload.total;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ADD
      .addCase(addProduct.fulfilled, (state, action) => {
        state.products.unshift(action.payload);
      })

      // DELETE
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (p) => p._id !== action.payload
        );
      });
  },
});

export default productSlice.reducer;
