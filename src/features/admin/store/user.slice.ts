import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { UserState } from '../../../shared/types/user.types';
import { User } from '../../../shared/types/api.types';
import { userService } from '../services/user.service';

const initialState: UserState = {
    users: [],
    clients: [],
    livreurs: [],
    loading: false,
    error: null,
};

export const fetchClients = createAsyncThunk(
    'user/fetchClients',
    async (_, { rejectWithValue }) => {
        try {
            return await userService.getClients();
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch clients');
        }
    }
);

export const fetchLivreurs = createAsyncThunk(
    'user/fetchLivreurs',
    async (_, { rejectWithValue }) => {
        try {
            return await userService.getLivreurs();
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch livreurs');
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearUserError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchClients.fulfilled, (state, action: PayloadAction<User[]>) => {
                state.clients = action.payload;
            })
            .addCase(fetchLivreurs.fulfilled, (state, action: PayloadAction<User[]>) => {
                state.livreurs = action.payload;
            })
            // Global loading/error could be handled here or per action
            .addMatcher(
                (action) => action.type.endsWith('/pending'),
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                (action) => action.type.endsWith('/fulfilled'),
                (state) => {
                    state.loading = false;
                }
            )
            .addMatcher(
                (action) => action.type.endsWith('/rejected'),
                (state, action) => {
                    state.loading = false;
                    state.error = action.payload as string;
                }
            );
    },
});

export const { clearUserError } = userSlice.actions;
export default userSlice.reducer;
