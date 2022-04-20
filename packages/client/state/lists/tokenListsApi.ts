import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { TokenInfo, TokenList } from "@uniswap/token-lists";

// Define a service using a base URL and expected endpoints

export const tokensApi = createApi({
  reducerPath: "tokensApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://tokens.uniswap.org/" }),
  endpoints: (builder) => ({
    getTokensList: builder.query<TokenList, string>({
      query: () => ``,
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetTokensListQuery } = tokensApi;
