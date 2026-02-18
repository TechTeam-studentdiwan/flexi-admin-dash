import { createSlice } from "@reduxjs/toolkit";
import { getAllOrders, updateOrderByAdminThunk } from "./ordersThunks";

const initialState = {
  orders: [],
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  },
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // 🔹 GET ALL ORDERS
      .addCase(getAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.data;
        state.pagination = action.payload.pagination;
      })

      .addCase(getAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateOrderByAdminThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateOrderByAdminThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.map((order) =>
          order._id === action.payload._id
            ? action.payload
            : order
        );
      })

      .addCase(updateOrderByAdminThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrderError } = orderSlice.actions;
export default orderSlice.reducer;
