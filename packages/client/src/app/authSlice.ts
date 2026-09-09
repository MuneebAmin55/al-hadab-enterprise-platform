import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

interface AuthState {
  user: UserProfile | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}

const initialToken = localStorage.getItem("alhadab_token");
const initialUser = localStorage.getItem("alhadab_user")
  ? JSON.parse(localStorage.getItem("alhadab_user")!)
  : null;

const initialState: AuthState = {
  user: initialUser,
  accessToken: initialToken,
  isAuthenticated: !!initialToken
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: UserProfile; accessToken: string }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      localStorage.setItem("alhadab_token", action.payload.accessToken);
      localStorage.setItem("alhadab_user", JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem("alhadab_token");
      localStorage.removeItem("alhadab_user");
    }
  }
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
