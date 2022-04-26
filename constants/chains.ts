/**
 * List of all the networks supported
 */
export enum SupportedChainId {
  MAINNET = 1,
  ROPSTEN = 3,
  POLYGON = 137,
  POLYGON_MUMBAI = 80001,
}

export const CHAIN_IDS_TO_NAMES = {
  [SupportedChainId.MAINNET]: "mainnet",
  [SupportedChainId.ROPSTEN]: "ropsten",
  [SupportedChainId.POLYGON]: "polygon",
  [SupportedChainId.POLYGON_MUMBAI]: "polygon_mumbai",
};

/**
 * Array of all the supported chain IDs
 */
export const ALL_SUPPORTED_CHAIN_IDS: SupportedChainId[] = Object.values(
  SupportedChainId
).filter((id) => typeof id === "number") as SupportedChainId[];
