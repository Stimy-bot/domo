// client/src/config/apiClient.ts
import axios from "axios";
import queryClient from "../config/queryClient";
import { UNAUTHORIZED } from "@domo/constants";
import { navigate } from "../lib/navigation";
import { useAuthStore } from "@domo/state";
import { authStorage } from "@domo/utils";

const BASE_URL = import.meta.env.VITE_API_URL || "https://the-one-server.onrender.com/api";

const options = {
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
const getErrorData = (error: any) => {
  const responseData = error.response?.data;

  if (responseData?.errors && Array.isArray(responseData.errors)) {
    return {
      message: responseData.message || "Validation failed",
      validationErrors: responseData.errors,
      displayMessage: responseData.errors
        .map((e: any) => `${e.path.join('.')}: ${e.message}`)
        .join(', ')
    };
  }

  if (typeof responseData === "string" && responseData.includes("<!doctype html>")) {
    return { message: "API URL mismatch (Received HTML)", errorCode: "HTML_RESPONSE_ERROR" };
  }

  return responseData || {};
};

API.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const { config, response } = error;
    const status = response?.status || 500;
    const data = getErrorData(error);

    // Handle 401 Unauthorized
    if (status === UNAUTHORIZED && !config._retry) {
      config._retry = true;

      // Access Token expired
      if (data.errorCode === "InvalidAccessToken") {
        try {
          const refreshed = await TokenRefreshClient.get("/auth/refresh");

          // Update Zustand + localStorage
          login({
            user: useAuthStore.getState().user!,
            accessToken: refreshed.accessToken,
            refreshToken: useAuthStore.getState().refreshToken!,
          });

          authStorage.save(
            useAuthStore.getState().user!,
            refreshed.accessToken,
            useAuthStore.getState().refreshToken!
          );

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
