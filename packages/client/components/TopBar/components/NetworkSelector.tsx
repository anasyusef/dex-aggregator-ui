import { Button, Menu, MenuItem, Stack, Typography } from "@mui/material";
import { useState, useEffect, MouseEvent, ReactNode } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Image from "next/image";
import ethereumLogo from "assets/images/ethereum-logo.png";
import polygonLogo from "assets/svg/polygon-matic-logo.svg";
import { CHAIN_INFO } from "constants/chainInfo";
import { useWeb3 } from "contexts/Web3Provider";
import { ALL_SUPPORTED_CHAIN_IDS, SupportedChainId } from "constants/chains";
import { switchToNetwork } from "utils/switchToNetwork";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

const getExplorerLabel = (chainId: SupportedChainId) => {
  switch (chainId) {
    case SupportedChainId.POLYGON:
    case SupportedChainId.POLYGON_MUMBAI:
      return "Polygonscan";
    default:
      return "Etherscan";
  }
};

interface MenuItemInnerProps {
  onClick: (targetChain: number) => void;
  targetChain: SupportedChainId;
}
function MenuItemInner({ onClick, targetChain }: MenuItemInnerProps) {
  const { chainId } = useWeb3();
  if (!chainId) return null;
  const active = chainId === targetChain;
  const { helpCenterUrl, explorer, bridge, label, logoUrl } =
    CHAIN_INFO[targetChain];

  const handleClick = () => {
    onClick(targetChain);
  };
  return (
    <MenuItem selected={active} onClick={handleClick}>
      <Stack spacing={1}>
        <Stack spacing={1.5} justifyContent={"flex-start"} direction="row">
          <Image
            width={20}
            height={20}
            src={logoUrl}
            alt={label}
            objectFit="contain"
          />
          <Typography variant="body1">{label}</Typography>
        </Stack>

        {active && (
          <Button
            size="small"
            endIcon={<OpenInNewIcon />}
            target={"_blank"}
            href={explorer}
          >
            {getExplorerLabel(targetChain)}
          </Button>
        )}
      </Stack>
    </MenuItem>
  );
}

export default function ChainMenu() {
  const { chainId, isNetworkSupported, provider, isAccountActive } = useWeb3();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  if (!isNetworkSupported) {
    return (
      <Button variant="outlined" disabled>
        Network not supported
      </Button>
    );
  }

  const handleSwitchNetwork = async (targetChain: number) => {
    if (provider) {
      await switchToNetwork({
        provider: provider.provider,
        chainId: targetChain,
      });
    }
  };

  const { label, logoUrl } = CHAIN_INFO[chainId || SupportedChainId.MAINNET];
  return (
    <>
      <Button
        id="chainIdButton"
        variant="outlined"
        aria-controls={open ? "network-selector-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        startIcon={<Image height={20} width={20} src={logoUrl} alt={label} />}
        endIcon={<KeyboardArrowDownIcon />}
      >
        {label}
      </Button>
      <Menu
        id="network-selector-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "chainIdButton",
        }}
      >
        <Typography color="GrayText" variant="body1" sx={{ py: 1, px: 3 }}>
          Select a network
        </Typography>
        <MenuItemInner
          onClick={handleSwitchNetwork}
          targetChain={SupportedChainId.MAINNET}
        />
        <MenuItemInner
          onClick={handleSwitchNetwork}
          targetChain={SupportedChainId.POLYGON}
        />
      </Menu>
    </>
  );
}
