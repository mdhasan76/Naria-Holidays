import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  user: any; // Replace `any` with your actual user type, e.g., `User | null`
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer; // ✅ Export only the reducer as default

export const selectUserState = (state: { user: UserState }) => state.user;
