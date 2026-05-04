import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryAdapter } from "../adapters/baseQueryAdapter";
import { AuthTags } from "../auth/types/tags";

const tagTypes = [...Object.values(AuthTags)];

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryAdapter,
  endpoints: () => ({}),
  tagTypes,
  refetchOnFocus: false,
  refetchOnReconnect: false,
});
