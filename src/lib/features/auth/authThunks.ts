import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/axios";
import { CurrentUser } from "@/types";
import { ApiResponse } from "@/types";
import { AxiosError } from "axios";

export const getCurrentUser = createAsyncThunk<
     CurrentUser,
     void,
     { rejectValue: string }
>("auth/getCurrentUser", async (_, { rejectWithValue }) => {
     try {
          const data = await api.get<ApiResponse<{user:CurrentUser}>>("auth/me");
          return data.data.data.user;
     } catch (error) {
          const err = error as AxiosError;

          return rejectWithValue(
               (err.response?.data as { message?: string })?.message ||
                    "Failed to fetch user",
          );
     }
});
