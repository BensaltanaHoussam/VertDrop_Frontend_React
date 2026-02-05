import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/store/auth.slice';
import parcelReducer from '../features/admin/store/parcel.slice';
import userReducer from '../features/admin/store/user.slice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        parcel: parcelReducer,
        user: userReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
