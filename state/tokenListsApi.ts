import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { TokenInfo } from "@uniswap/token-lists";

// Define a service using a base URL and expected endpoints

interface IVersion {
  major: number;
  minor: number;
  patch: number;
}

interface TokensListApiResponse {
  keywords?: string[];
  logoURI?: string;
  name?: string;
  timestamp?: string;
  tokens: TokenInfo[];
  version?: IVersion;
}
export const tokensApi = createApi({
  reducerPath: "tokensApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://tokens.uniswap.org/" }),
  endpoints: (builder) => ({
    getTokensList: builder.query<TokensListApiResponse, string>({
      query: () => ``,
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetTokensListQuery } = tokensApi;
