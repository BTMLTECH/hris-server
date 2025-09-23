/* eslint-disable @typescript-eslint/no-explicit-any */
import { store } from "@/store/store";

// Reusable helper
export const refreshEndpoint = (
  endpoint: any,
  queryParams: Record<string, any>
) => {
  return store.dispatch(
    endpoint.initiate(queryParams, {
      subscribe: false,
    })
  );
};
