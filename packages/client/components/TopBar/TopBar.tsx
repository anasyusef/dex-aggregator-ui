import {
  AppBar,
  Box,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import DarkModeOutlined from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlined from "@mui/icons-material/LightModeOutlined";
import { useTheme } from "@mui/material/styles";
import { unstable_useEnhancedEffect as useEnhancedEffect } from "@mui/material/utils";
import { capitalize } from "lodash";
import { useDispatch } from "react-redux";
import { useAppSelector } from "state";
import { selectMode, setMode } from "state/userSlice";
import NetworkSelector from "./components/NetworkSelector";
import WalletButton from "./components/WalletButton";
import { useContext } from "react";
import { DispatchContext } from "../ThemeProvider";

export default function TopBar() {
  const dispatch = useDispatch();
  const themeMode = useAppSelector(selectMode);
  const theme = useTheme();
  const d = useContext(DispatchContext);
  const [tooltipLabel, setTooltipLabel] = useState("");

  useEnhancedEffect(() => {
    setTooltipLabel(`${capitalize(themeMode || "light")} mode`);
  }, [themeMode]);

  const handleChangeThemeMode = () => {
    // d({
    //   type: 'CHANGE',
    //   payload: { paletteMode: theme.palette.mode === "light" ? "dark" : "light" },
    // });
    dispatch(setMode(themeMode === "light" ? "dark" : "light"));
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar elevation={0} color="inherit" position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            DEX Aggregator
          </Typography>
          <Stack sx={{ mr: 3 }} gap={3} direction={"row"}>
            <NetworkSelector />
            <WalletButton />
          </Stack>
          {/* <Tooltip aria-label={tooltipLabel} title={tooltipLabel}> */}
            <IconButton
              disabled
              size="large"
              onClick={handleChangeThemeMode}
              color="inherit"
            >
              {theme.palette.mode === "dark" ? (
                <DarkModeOutlined />
              ) : (
                <LightModeOutlined />
              )}
            </IconButton>
          {/* </Tooltip> */}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
