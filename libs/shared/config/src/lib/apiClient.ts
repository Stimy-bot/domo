// client/src/config/apiClient.ts
import axios from "axios";
import queryClient from "./queryClient";
// import { UNAUTHORIZED } from "@domo/constants";
import { navigate } from "@domo/utils";

// Use a fallback that matches your actual backend service name
const viteEnv = (import.meta as ImportMeta & {
  env?: Record<string, string | undefined>;
}).env;
const BASE_URL = viteEnv?.VITE_API_URL || "https://the-one-server.onrender.com/api";

const options = {
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
};

const TokenRefreshClient = axios.create(options);
const API = axios.create(options);

/**
 * Extracts error data from the given error object.
 * If the error response contains just a message string, it will be returned as is.
 * If the error response contains an array of errors, they will be formatted into a string of "path: message" pairs.
 * If the error response is an HTML string (e.g. due to a server error), it will return an error message indicating this.
 * @param {any} error - The error object to extract data from
 * @returns {{ message: string, displayMessage?: string, ...responseData }} - The extracted error data
 */
// Helper to safely parse error data
const getErrorData = (error: any) => {
  const responseData = error.response?.data;

  // NEW: Capture specific Zod validation errors from the backend
  if (responseData?.errors && Array.isArray(responseData.errors)) {
    return {
      message: responseData.message || "Validation failed",
      validationErrors: responseData.errors, // This holds the Array(2)
      // Provide a more readable message for the UI
      displayMessage: responseData.errors.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ')
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
    const data = getErrorData(error); // Safely get the error object

    // Handle 401 Unauthorized
    if (status === (401) && !config._retry) {
      config._retry = true;

      // Handle Access Token Expiration
      if (data.errorCode === "InvalidAccessToken") {
        try {
          await TokenRefreshClient.get("/auth/refresh");
          return API(config); // Retry original request
        } catch (refreshError) {
          queryClient.clear();
          navigate("/login", {
            state: { redirectUrl: window.location.pathname },
          });
          return Promise.reject(refreshError);
        }
      }

      // Handle Inactive Account
      if (data.errorCode === "AccountInactive") {
        queryClient.clear();
        navigate("/login", {
          state: { message: "Your account is deactivated. Please contact support." },
        });
        return Promise.reject({ status, ...data });
      }
    }

    // Return a standardized error object
    return Promise.reject({
      status: status || 500,
message: data.displayMessage || data.message || "An unexpected error occurred",      ...data,
    });
  }
);

export { API };