import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, LoginCredentials, AuthResponse } from '../types/auth.types';
import { authService } from '../services/auth.service';

const initialState: AuthState = {
    user: null,
    token: localStorage.getItem('vertdrop_token'),
    isAuthenticated: !!localStorage.getItem('vertdrop_token'),
    loading: false,
    error: null,
};

export const login = createAsyncThunk(
    'auth/login',
    async (credentials: LoginCredentials, { rejectWithValue }) => {
        try {
            const response = await authService.login(credentials);
            localStorage.setItem('vertdrop_token', response.token);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    }
);

export const fetchProfile = createAsyncThunk(
    'auth/fetchProfile',
    async (_, { rejectWithValue }) => {
        try {
            return await authService.getProfile();
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
            localStorage.removeItem('vertdrop_token');
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Fetch Profile
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(fetchProfile.rejected, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                state.token = null;
                localStorage.removeItem('vertdrop_token');
            });
    },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
