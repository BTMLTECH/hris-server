/* eslint-disable @typescript-eslint/no-explicit-any */
import { EndpointBuilder } from "@reduxjs/toolkit/query/react";

export function createPaginatedQuery<
  TData,
  TParams extends Record<string, any>
>(
  builder: EndpointBuilder<any, any, any>,
  options: {
    baseUrl: string;
    tagType: string;
    defaultLimit?: number;
    buildParams?: (params: TParams) => URLSearchParams;
    extraOptions?: Record<string, any>;
    filterKeys?: string[];
  }
) {
  const {
    baseUrl,
    tagType,
    defaultLimit = 20,
    buildParams,
    extraOptions,
    filterKeys,
  } = options;

  return builder.query<
    { data: { data: TData[]; pagination?: any } },
    TParams & { page?: number; limit?: number }
  >({
    query: (params) => {
      const { page = 1, limit = defaultLimit, ...rest } = params;

      const queryParams = buildParams
        ? buildParams(params)
        : new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
          });

      // ✅ Only append whitelisted filter keys if provided
      Object.entries(rest).forEach(([key, value]) => {
        if (
          (!filterKeys || filterKeys.includes(key)) &&
          value !== undefined &&
          value !== null &&
          value !== "" &&
          value !== "all"
        ) {
          queryParams.append(key, String(value));
        }
      });

      return {
        url: `${baseUrl}?${queryParams.toString()}`,
        method: "GET",
        ...extraOptions,
      };
    },
    providesTags: (result) =>
      result
        ? [
            ...(result.data?.data || []).map((item: any) => ({
              type: tagType as any,
              id: item._id ?? item.id,
            })),
            { type: tagType, id: "LIST" },
          ]
        : [{ type: tagType, id: "LIST" }],
  });
}
