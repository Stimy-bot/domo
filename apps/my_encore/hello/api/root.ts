import { api } from "encore.dev/api";

export const root = api(
  { method: "GET", path: "/" },
  async () => {
    return {
      message: "Encore + MongoDB service is running",
      endpoints: [
        "/users",
        "/users/:id",
        "/mongo/ping"
      ]
    };
  }
);
