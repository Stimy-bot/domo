import { api } from "encore.dev/api";

export const root = api.static({
  path: "/",
  dir: "./views",

});

