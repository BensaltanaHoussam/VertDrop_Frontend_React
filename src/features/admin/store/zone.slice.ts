import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Zone } from '../../../shared/types/parcel.types';
import { zoneService } from '../services/zone.service';

interface ZoneState {
    items: Zone[];
    loading: boolean;
    error: string | null;
}

const initialState: ZoneState = {
    items: [],
    loading: false,
    error: null,
};

export const fetchZones = createAsyncThunk(
    'zone/fetchZones',
    async (_, { rejectWithValue }) => {
        try {
            return await zoneService.getZones();
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch zones');
        }
    }
);

export const createZone = createAsyncThunk(
    'zone/createZone',
    async (zone: Partial<Zone>, { rejectWithValue }) => {
        try {
            return await zoneService.createZone(zone);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create zone');
        }
    }
);

const zoneSlice = createSlice({
    name: 'zone',
    initialState,
    reducers: {
        clearZoneError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchZones.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchZones.fulfilled, (state, action: PayloadAction<Zone[]>) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchZones.rejected, (state, action) => {
                state.loading = false;
                state.error = (action as any).payload as string;
            })
            .addCase(createZone.fulfilled, (state, action: PayloadAction<Zone>) => {
                state.items.push(action.payload);
            });
    },
});

export const { clearZoneError } = zoneSlice.actions;
export default zoneSlice.reducer;
