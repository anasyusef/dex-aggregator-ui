import {
  Percent,
  Token,
  Trade,
  ChainId,
  Fetcher,
  Pair,
  Route,
  CurrencyAmount,
  TradeType,
  TokenAmount,
  BigintIsh,
} from "@uniswap/sdk";
import { BigNumber, getDefaultProvider } from "ethers";
import { ethers, waffle } from "hardhat";
import tokens from "../test/utils/tokens";

interface Path {
  address: string;
  decimals: number;
}

interface CreateTrade {
  amount: BigintIsh;
  path: Path[];
  tradeType: TradeType;
  provider?: ReturnType<typeof getDefaultProvider>;
}

async function createUniswapTrade({
  amount,
  tradeType,
  path,
  provider,
}: CreateTrade) {
  if (path.length < 2) {
    throw new Error(`Cannot create a pair with ${path.length} tokens`);
  }

  const tokens = path.map(
    (token) => new Token(ChainId.MAINNET, token.address, token.decimals)
  );

  const pairs: Pair[] = [];

  for (let i = 1; i < tokens.length; i++) {
    pairs.push(await Fetcher.fetchPairData(tokens[i], tokens[i - 1], provider));
  }

  return new Trade(
    new Route(pairs, tokens[0], tokens[tokens.length - 1]),
    new TokenAmount(tokens[0], amount),
    tradeType
  );
}

async function main() {
  const provider = waffle.provider;
  const amount = ethers.utils.parseEther("0.1");
  const path = [tokens.WETH, tokens.DAI, tokens.USDC];
  const slippageTolerance = new Percent("50", "10000");
  const trade = await createUniswapTrade({
    amount: amount.toString(),
    path,
    tradeType: TradeType.EXACT_INPUT,
    provider,
  });
}

main().catch((err) => {
  console.log(err);
  process.exitCode = 1;
});
