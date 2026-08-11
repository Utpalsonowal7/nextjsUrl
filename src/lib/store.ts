import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/lib/features/auth/authSlice";
import linkReducer from "@/lib/features/link/linkSlice";

export const makeStore = () => {
     return configureStore({
          reducer: {
               auth: authReducer,
               link: linkReducer,
          },
     });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
