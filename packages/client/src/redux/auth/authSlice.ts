import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  authenticated: boolean;
  processedAuth: boolean;
}

const initialState: AuthState = {
  authenticated: false,
  processedAuth: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthenticated(state, action: PayloadAction<boolean>) {
      state.authenticated = action.payload;
      state.processedAuth = true;
    },
    logout(state) {
      state.authenticated = false;
      state.processedAuth = true;
    },
  },
});

export const { setAuthenticated, logout } = authSlice.actions;
export default authSlice.reducer;
