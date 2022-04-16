import { Button, Menu, MenuItem, Stack, Typography } from "@mui/material";
import { useState, useEffect, MouseEvent } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Image from "next/image";
import ethereumLogo from "assets/images/ethereum-logo.png";
import polygonLogo from "assets/svg/polygon-matic-logo.svg";

export default function ChainMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const supportedChains = {};

  return (
    <div>
      <Button
        id="basic-button"
        variant="outlined"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        startIcon={
          <Image
            height={20}
            width={20}
            src={ethereumLogo}
            alt="ethereum logo"
          />
        }
        endIcon={<KeyboardArrowDownIcon />}
      >
        Ethereum
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <Typography color="GrayText" variant="body1" sx={{ py: 1, px: 3}}>Select a network</Typography>
        <MenuItem onClick={handleClose}>
          <Stack spacing={1.5} justifyContent={"space-between"} direction="row">
            <Image
              width={20}
              height={20}
              src={ethereumLogo}
              alt="ethereum logo"
              objectFit="contain"
            />
            <Typography variant="body1">Ethereum</Typography>
          </Stack>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Image width={20} height={20} src={polygonLogo} alt="polygon logo" />
          Polygon
        </MenuItem>
      </Menu>
    </div>
  );
}
