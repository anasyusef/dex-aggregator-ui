import { constructSameAddressMap } from "utils/constructSameAddressMap";
import { SupportedChainId } from "./chains";
import { FACTORY_ADDRESS as V2_FACTORY_ADDRESS } from "@uniswap/v2-sdk";
import { FACTORY_ADDRESS as V3_FACTORY_ADDRESS } from "@uniswap/v3-sdk";

type AddressMap = { [chainId: number]: string };

export const MULTICALL_ADDRESS: AddressMap = {
  ...constructSameAddressMap("0x1F98415757620B543A52E61c46B32eB19261F984", [
    SupportedChainId.POLYGON_MUMBAI,
    SupportedChainId.POLYGON,
  ]),
};

export const V2_FACTORY_ADDRESSES: AddressMap =
  constructSameAddressMap(V2_FACTORY_ADDRESS);

export const MERKLE_DISTRIBUTOR_ADDRESS: AddressMap = {
  [SupportedChainId.MAINNET]: "0x090D4613473dEE047c3f2706764f49E0821D256e",
};
export const ARGENT_WALLET_DETECTOR_ADDRESS: AddressMap = {
  [SupportedChainId.MAINNET]: "0xeca4B0bDBf7c55E9b7925919d03CbF8Dc82537E8",
};
export const ENS_REGISTRAR_ADDRESSES: AddressMap = {
  [SupportedChainId.MAINNET]: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
  [SupportedChainId.ROPSTEN]: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
};
export const SOCKS_CONTROLLER_ADDRESSES: AddressMap = {
  [SupportedChainId.MAINNET]: "0x65770b5283117639760beA3F867b69b3697a91dd",
};

export const QUOTER_ADDRESSES: AddressMap = constructSameAddressMap(
  "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6",
  [SupportedChainId.POLYGON_MUMBAI, SupportedChainId.POLYGON]
);

export const V3_CORE_FACTORY_ADDRESSES: AddressMap = constructSameAddressMap(
  V3_FACTORY_ADDRESS,
  [SupportedChainId.POLYGON_MUMBAI, SupportedChainId.POLYGON]
);
