import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { customerApi } from '@/lib/api';

interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  name: string;
  email: string;
  phone?: string;
  addresses?: any[];
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

export const fetchProfile = createAsyncThunk('auth/fetchProfile', async (_, { rejectWithValue }) => {
  try {
    const res = await customerApi.getProfile();
    return res.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isLoading = false;
      localStorage.setItem('akodUserToken', action.payload.token);
      localStorage.setItem('akodAuth', 'true');
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      localStorage.removeItem('akodUserToken');
      localStorage.removeItem('akodAuth');
      customerApi.logout().catch(console.error);
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { login, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
