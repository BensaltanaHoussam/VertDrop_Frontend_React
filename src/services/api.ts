import axios, { type AxiosError } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for adding the auth token
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('vertdrop_token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            const status = error.response.status;

            if (status === 401) {
                // Unauthorized - clear token and redirect to login
                localStorage.removeItem('vertdrop_token');
                window.location.href = '/login';
            } else if (status === 403) {
                console.error('Forbidden: You do not have permission to access this resource.');
            } else if (status === 404) {
                console.error('Not Found: The requested resource was not found.');
            } else if (status >= 500) {
                console.error('Server Error: A server-side error occurred.');
            }
        } else if (error.request) {
            // The request was made but no response was received
            console.error('Network Error: No response received from server.');
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error:', error.message);
        }

        return Promise.reject(error);
    }
);
