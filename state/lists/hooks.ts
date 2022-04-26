import { useWeb3 } from "contexts/Web3Provider";
import { ChainTokenMap, tokensToChainTokenMap } from "hooks/useTokenList/utils";
import { useMemo } from "react";
import { useGetTokensListQuery } from "./tokenListsApi";
import { Token } from "@uniswap/sdk-core";

export type TokenAddressMap = ChainTokenMap;
