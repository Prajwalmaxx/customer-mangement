import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { checkEmailAvailability, loginRequest, registerRequest } from '../api/authApi';
import {
  clearAuthStorage,
  clearRememberEmail,
  getRememberEmail,
  getStoredUser,
  getToken,
  isRememberMeEnabled,
  setRememberEmail,
  setRememberMeEnabled,
  setSessionCookie,
  setStoredUser,
  setToken,
} from '../lib/storage';

const initialToken = getToken();
const initialUser = getStoredUser();

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password, remember }, { rejectWithValue }) => {
    try {
      const payload = await loginRequest({ email, password });
      return { payload, remember, email };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message ?? error.message ?? 'Login failed.');
    }
  },
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (form, { rejectWithValue }) => {
    try {
      const availability = await checkEmailAvailability(form.email);
      if (availability.exists) {
        return rejectWithValue(availability.message);
      }
      const payload = await registerRequest({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      return payload;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message ?? error.message ?? 'Registration failed.');
    }
  },
);

export const checkSignupEmail = createAsyncThunk('auth/checkEmail', async (email, { rejectWithValue }) => {
  try {
    return await checkEmailAvailability(email);
  } catch (error) {
    return rejectWithValue(error.response?.data?.message ?? error.message ?? 'Could not verify email.');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: initialToken,
    user: initialUser,
    isAuthenticated: Boolean(initialToken),
    remember: isRememberMeEnabled(),
    rememberedEmail: getRememberEmail(),
    loading: false,
    error: null,
    emailStatus: null,
  },
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      clearAuthStorage();
    },
    setRemember(state, action) {
      state.remember = action.payload;
      setRememberMeEnabled(action.payload);
      if (!action.payload) {
        clearRememberEmail();
        state.rememberedEmail = '';
      }
    },
    clearAuthError(state) {
      state.error = null;
    },
    clearEmailStatus(state) {
      state.emailStatus = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const { payload, remember, email } = action.payload;
        state.loading = false;
        state.token = payload.token;
        state.user = payload.user;
        state.isAuthenticated = true;
        state.remember = remember;
        setToken(payload.token);
        setStoredUser(payload.user);
        setSessionCookie();
        setRememberMeEnabled(remember);
        if (remember) {
          setRememberEmail(email);
          state.rememberedEmail = email;
        } else {
          clearRememberEmail();
          state.rememberedEmail = '';
        }
        toast.success('Logged in successfully.');
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        setToken(action.payload.token);
        setStoredUser(action.payload.user);
        setSessionCookie();
        toast.success('Account created successfully.');
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      .addCase(checkSignupEmail.fulfilled, (state, action) => {
        state.emailStatus = {
          tone: action.payload.exists ? 'error' : 'success',
          message: action.payload.message,
          exists: action.payload.exists,
        };
      })
      .addCase(checkSignupEmail.rejected, (state, action) => {
        state.emailStatus = {
          tone: 'error',
          message: action.payload,
          exists: false,
        };
      });
  },
});

export const { logout, setRemember, clearAuthError, clearEmailStatus } = authSlice.actions;
export default authSlice.reducer;
