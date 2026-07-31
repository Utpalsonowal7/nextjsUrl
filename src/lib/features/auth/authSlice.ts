import { createSlice } from "@reduxjs/toolkit";
import { CurrentUser } from "@/types";
import { getCurrentUser } from "./authThunks";
import { RootState } from "@/lib/store";

interface AuthState {
     user: CurrentUser | null;
     status: "idle" | "loading" | "success" | "failed";
     error: string | null;
}

const initialState: AuthState = {
     user: null,
     status: "idle",
     error: null,
};

const authSlice = createSlice({
     name: "auth",
     initialState,
     reducers: {
          clearUser: (state) => {
               state.user = null;
               state.status = "idle";
               state.error = null;
          },
     },
     extraReducers: (builder) => {
          builder
               .addCase(getCurrentUser.pending, (state) => {
                    state.status = "loading";
                    state.error = null;
               })
               .addCase(getCurrentUser.fulfilled, (state, action) => {
                    state.status = "success";
                    state.user = action.payload;
               })
               .addCase(getCurrentUser.rejected, (state, action) => {
                    state.status = "failed";
                    state.error =
                         action.payload ?? "Failed to get current user";
                         state.user = null;

               });
     },
});

export const { clearUser } = authSlice.actions;

export const currentUser = (state: RootState) => state.auth.user;
export const state = (state: RootState) => state.auth.status;
export const error = (state: RootState) => state.auth.error;

export default authSlice.reducer;
