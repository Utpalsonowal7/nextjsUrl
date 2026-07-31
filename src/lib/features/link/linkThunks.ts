import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/axios";
import { PostLink } from "@/types";
import { PostLinkresponse } from "@/types";
import { AxiosError } from "axios";

export const createShortLink = createAsyncThunk<
     PostLinkresponse,
     PostLink,
     { rejectValue: string }
>("links/createLink", async (data, { rejectWithValue }) => {
     try {
          const res = await api.post<PostLinkresponse>("links", data);

          return res.data;
     } catch (error) {
          const err = error as AxiosError;

          return rejectWithValue(err?.message || "Failed to create shortlink");
     }
});
