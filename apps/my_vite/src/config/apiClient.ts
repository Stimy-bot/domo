import axios, { AxiosError, type AxiosRequestConfig, type AxiosResponse } from "axios";
import queryClient from "../config/queryClient.js";
import { UNAUTHORIZED } from "@domo/types";
import { navigate } from "../lib/navigation.js";
import { useAuthStore } from "@domo/state";
import { authStorage } from "@domo/utils";

// Define the shape of your token refresh response
interface RefreshTokenResponse {
  accessToken: string;
}

// Define the shape of validation error objects from your API
interface ValidationErrorItem {
  path: string[];
  message: string;
}

interface ApiErrorData {
  message?: string;
  errorCode?: string;
  errors?: ValidationErrorItem[];
  displayMessage?: string;
}

const BASE_URL =
  ((import.meta as ImportMeta & { env?: { VITE_API_URL?: string } }).env
    ?.VITE_API_URL) ||
  "https://the-one-server.onrender.com/api";

const options: AxiosRequestConfig = {
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
};

const TokenRefreshClient = axios.create(options);
const API = axios.create(options);

// Extract Zustand actions
const { logout, login } = useAuthStore.getState();

/**
 * Extracts error data from the given error object.
 */
const getErrorData = (error: AxiosError<ApiErrorData | string>): ApiErrorData => {
  const responseData = error.response?.data;

  if (typeof responseData === "object" && responseData !== null) {
    if (Array.isArray(responseData.errors)) {
      return {
        message: responseData.message || "Validation failed",
        errors: responseData.errors,
        displayMessage: responseData.errors
          .map((e) => `${e.path.join(".")}: ${e.message}`)
          .join(", "),
      };
    }
    return responseData;
  }

  if (typeof responseData === "string" && responseData.includes("<!doctype html>")) {
    return {
      message: "API URL mismatch (Received HTML)",
      errorCode: "HTML_RESPONSE_ERROR",
    };
  }

  return {};
};

API.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  async (error: AxiosError<ApiErrorData>) => {
    const config = error.config as AxiosRequestConfig & { _retry?: boolean };
    const status = error.response?.status || 500;
    const data = getErrorData(error);

    // Handle 401 Unauthorized
    if (status === UNAUTHORIZED && config && !config._retry) {
      config._retry = true;

      // Access Token expired
      if (data.errorCode === "InvalidAccessToken") {
        try {
          // Type the response data so `.data.accessToken` works cleanly
          const response = await TokenRefreshClient.get<RefreshTokenResponse>("/auth/refresh");
          const refreshed = response.data;

          const currentUser = useAuthStore.getState().user;
          const currentRefreshToken = useAuthStore.getState().refreshToken;

          // Safe guards replacing non-null assertions (!)
          if (currentUser && currentRefreshToken) {
            login({
              user: currentUser,
              accessToken: refreshed.accessToken,
              refreshToken: currentRefreshToken,
            });

            authStorage.save(currentUser, refreshed.accessToken, currentRefreshToken);
          }

          return API(config); // Retry original request
        } catch (refreshError) {
          // Clear Zustand + redirect
          authStorage.clear();
          logout();
          queryClient.clear();

          navigate("/login", {
            state: { redirectUrl: window.location.pathname },
          });

          return Promise.reject(refreshError);
        }
      }

      // Inactive account
      if (data.errorCode === "AccountInactive") {
        authStorage.clear();
        logout();
        queryClient.clear();

        navigate("/login", {
          state: { message: "Your account is deactivated. Please contact support." },
        });

        return Promise.reject({ status, ...data });
      }
    }

    // Standardized error object
    return Promise.reject({
      status,
      message: data.displayMessage || data.message || "An unexpected error occurred",
      ...data,
    });
  }
);

export default API;