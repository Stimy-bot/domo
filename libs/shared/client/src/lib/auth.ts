// libs/shared/client/src/lib/auth.ts
import { API } from '@domo/config';
import axios, { type AxiosError } from 'axios';

type RegisterData = {
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  bio?: string;
  gender?: string;
  birthDate?: Date;
  firstName: string;
  lastName: string;
};

export const register = async (data: RegisterData) => {
  try {
    const response = await API.post('/auth/register', data);
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ error: string }>;
    if (error.response?.status === 409) {
      // Conflict: duplicate email/username
      throw new Error('This email is already registered.');
    }
    if (error.response?.status === 400) {
      throw new Error('Invalid registration data.');
    }
    throw new Error('Registration failed. Please try again.');
  }
};

type LoginData = {
  email: string;
  password: string;
};

export const login = async (data: LoginData) => API.post('/auth/login', data);

export const logout = async () => API.get('/auth/logout');

export const verifyEmail = async (verificationCode: string) => {
  const response = await API.get(`auth/email/verify/${verificationCode}`);
  return response.data;
};

export const sendPasswordResetEmail = async (email: string) =>
  API.post('/auth/password/forgot', { email });

export const resetPassword = async ({
  verificationCode,
  password,
}: {
  verificationCode: string;
  password: string;
}) => API.post('auth/password/reset', { verificationCode, password });

export const getSessions = async () => {
  // This will resolve to /api/sessions
  const response = await API.get('sessions');
  return response.data;
};

export const deleteSession = async (id: string) => API.delete(`sessions/${id}`);

export const getNewRefreshToken = async (): Promise<{ token: string }> => {
  // Use absolute path here because we are using raw 'axios', not our 'API' instance
  const isProd = process.env.NODE_ENV === 'production';
  const url = isProd
    ? 'https://the-one-server.onrender.com/api/auth/refresh'
    : 'http://127.0.0.1:5000/api/auth/refresh';

  const { data } = await axios.get(url, {
    withCredentials: true,
  });
  return data;
};

export const verifyOtp = async (phone: string, code: string) => {
  const response = await API.post('/auth/otp/verify', { phone, code });
  return response.data;
};

export const resendOtp = async (phone: string) => {
  const response = await API.post('/auth/otp/resend', { phone });
  return response.data;
};
