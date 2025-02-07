import { configureStore } from "@reduxjs/toolkit"; // ✅ Correct import

import { apiSlice } from "./apiSlice/apiSlice";
import { authReducer } from "./feature/authSlice";
import userReducer from "./feature/userSlice"; // ✅ Correct import

const store: any = configureStore({
  reducer: {
    user: userReducer,
    auth: authReducer,
    [apiSlice.reducerPath]: apiSlice.reducer, // ✅ Moved inside reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      apiSlice.middleware
    ), // ✅ Middleware should work correctly now
  devTools: true,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { store };
