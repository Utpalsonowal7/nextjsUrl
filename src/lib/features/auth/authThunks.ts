import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/axios";
import { CurrentUser } from "@/types";
import { AxiosError } from "axios";

export const getCurrentUser = createAsyncThunk<
     CurrentUser,
     void,
     { rejectValue: string }
>("auth/getCurrentUser", async (_, { rejectWithValue }) => {
     try {
          const data = await api.get<CurrentUser>("auth/me");
          return data.data;
     } catch (error) {
          const err = error as AxiosError;

          return rejectWithValue(err?.message || "Failed to fetch user");
     }
});
