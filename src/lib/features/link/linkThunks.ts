import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/axios";
import { PostLink } from "@/types";
import { ApiResponse } from "@/types";
import { AxiosError } from "axios";

export const createShortLink = createAsyncThunk<
     { longUrl: string; shortLink: string },
     PostLink,
     { rejectValue: string }
>("links/createLink", async (data, { rejectWithValue }) => {
     try {
          const res = await api.post<
               ApiResponse<{ longUrl: string; shortLink: string }>
          >("links", data);

          return res.data.data;
     } catch (error) {
          const err = error as AxiosError;

          return rejectWithValue(err?.message || "Failed to create shortlink");
     }
});
