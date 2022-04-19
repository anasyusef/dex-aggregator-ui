import { constructSameAddressMap } from "utils/constructSameAddressMap";
import { SupportedChainId } from "./chains";

type AddressMap = { [chainId: number]: string };

export const MULTICALL_ADDRESS: AddressMap = {
  ...constructSameAddressMap("0x1F98415757620B543A52E61c46B32eB19261F984", [
    SupportedChainId.POLYGON_MUMBAI,
    SupportedChainId.POLYGON,
  ]),
};

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
