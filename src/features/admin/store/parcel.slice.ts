import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ParcelState, Colis } from '../../../shared/types/parcel.types';
import { parcelService } from '../services/parcel.service';
import { Page } from '../../../shared/types/api.types';

const initialState: ParcelState = {
    items: [],
    selectedItem: null,
    loading: false,
    error: null,
    pagination: {
        page: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0,
    },
    filters: {
        keyword: '',
        statut: '',
        zoneId: null,
    },
};

export const fetchParcels = createAsyncThunk(
    'parcel/fetchParcels',
    async (_, { getState, rejectWithValue }) => {
        const { parcel } = getState() as { parcel: ParcelState };
        const { page, size } = parcel.pagination;
        const { keyword, statut, zoneId } = parcel.filters;

        try {
            return await parcelService.getParcels({
                page,
                size,
                keyword,
                statut,
                zoneId,
                sort: 'id,desc',
            });
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch parcels');
        }
    }
);

const parcelSlice = createSlice({
    name: 'parcel',
    initialState,
    reducers: {
        setPage: (state, action: PayloadAction<number>) => {
            state.pagination.page = action.payload;
        },
        setFilters: (state, action: PayloadAction<Partial<ParcelState['filters']>>) => {
            state.filters = { ...state.filters, ...action.payload };
            state.pagination.page = 0; // Reset to first page on filter change
        },
        clearParcelError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchParcels.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchParcels.fulfilled, (state, action: PayloadAction<Page<Colis>>) => {
                state.loading = false;
                state.items = action.payload.content;
                state.pagination.totalElements = action.payload.totalElements;
                state.pagination.totalPages = action.payload.totalPages;
            })
            .addCase(fetchParcels.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setPage, setFilters, clearParcelError } = parcelSlice.actions;
export default parcelSlice.reducer;
