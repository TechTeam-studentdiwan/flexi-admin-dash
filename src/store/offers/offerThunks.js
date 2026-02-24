import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {BACKEND_URL} from "../url"

export const getOffers = createAsyncThunk(
  "offers/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BACKEND_URL}/offers/all`, { withCredentials: true });
      return res.data.offers;
    } catch (err) {
      return rejectWithValue("Failed to fetch offers");
    }
  },
);

export const createOffer = createAsyncThunk(
  "offers/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BACKEND_URL}/offers/create`, data, {
        withCredentials: true,
      });
      return res.data.offer;
    } catch (err) {
      return rejectWithValue("Failed to create offer");
    }
  },
);

export const updateOffer = createAsyncThunk(
  "offers/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${BACKEND_URL}/offers/update/${id}`, data, {
        withCredentials: true,
      });
      return res.data.offer;
    } catch (err) {
      return rejectWithValue("Failed to update offer");
    }
  },
);

export const deleteOffer = createAsyncThunk(
  "offers/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${BACKEND_URL}/offers/delete/${id}`, { withCredentials: true });
      return id;
    } catch (err) {
      return rejectWithValue("Failed to delete offer");
    }
  },
);
