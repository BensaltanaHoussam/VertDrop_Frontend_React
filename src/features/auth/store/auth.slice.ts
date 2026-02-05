import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, LoginCredentials, AuthResponse } from '../types/auth.types';
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
    async (credentials: LoginCredentials, { dispatch, rejectWithValue }) => {
        try {
            const response = await authService.login(credentials);
            localStorage.setItem('vertdrop_token', response.token);
            // Fetch profile after successful login
            await dispatch(fetchProfile());
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
                if (action.payload.user) {
                    state.user = action.payload.user;
                }
                state.token = action.payload.token;
                state.isAuthenticated = true;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = (action as any).payload as string;
            })
            // Fetch Profile
            .addCase(fetchProfile.fulfilled, (state, action) => {
                const rawUser = action.payload as any;
                // Map backend fields to frontend User interface
                state.user = {
                    id: rawUser.id || 0,
                    email: rawUser.email || rawUser.username,
                    nom: rawUser.lastName || '',
                    prenom: rawUser.firstName || '',
                    // Map ROLE_MANAGER -> MANAGER, etc.
                    role: (rawUser.roles?.[0]?.replace('ROLE_', '') || 'CLIENT') as any,
                    telephone: rawUser.telephone
                };
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
