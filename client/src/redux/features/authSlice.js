
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  loading: false,
  error: null,
  success: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    // ================= LOGIN =================

    loginStart: (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    },

    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.error = null;
      state.success = "Login successful";
    },

    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = null;
    },

    // ================= SIGNUP =================

    signupStart: (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    },

    signupSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.error = null;
      state.success = "Account created successfully";
    },

    signupFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = null;
    },

    // ================= CLEAR =================

    clearMessages: (state) => {
      state.error = null;
      state.success = null;
    },

    // ================= LOGOUT =================

    logout: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
      state.success = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,

  signupStart,
  signupSuccess,
  signupFailure,

  clearMessages,
  logout,
} = authSlice.actions;

export default authSlice.reducer;