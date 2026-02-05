import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../app/store';
import { login, logout, clearError } from '../store/auth.slice';
import { LoginCredentials } from '../types/auth.types';

export const useAuth = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user, loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

    const handleLogin = (credentials: LoginCredentials) => {
        return dispatch(login(credentials)).unwrap();
    };

    const handleLogout = () => {
        dispatch(logout());
    };

    const handleClearError = () => {
        dispatch(clearError());
    };

    return {
        user,
        loading,
        error,
        isAuthenticated,
        login: handleLogin,
        logout: handleLogout,
        clearError: handleClearError,
        role: user?.role,
    };
};
