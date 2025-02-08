import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SetCredentialsPayload {
  user: string;
  accessToken: string;
}

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    accessToken: null,
    data: null,
    isLoading: false,
    error: null,
  } as any,
  reducers: {
    setCredentials: (state, action: PayloadAction<SetCredentialsPayload>) => {
      console.log(action, "this is action in authSlice ");
      const { accessToken, user } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
    },
    setUserInAuth: (state, action) => {
      state.user = action.payload;
    },
    logOut: (state) => {
      state.user = null;
      state.accessToken = null;
    },
  },
});

export const { setCredentials, logOut, setUserInAuth } = authSlice.actions;
export const authReducer = authSlice.reducer;

export const selectCurrentUser = (state: any) => state?.auth?.user;
export const selectCurrentUserState = (state: any) => state?.auth;
export const selectCurrentToken = (state: any) => state.auth.token;
