import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  CircularProgress,
  IconButton,
  Skeleton,
  Stack,
  styled,
  Typography,
  useTheme,
} from "@mui/material";
import Tooltip, { tooltipClasses, TooltipProps } from "@mui/material/Tooltip";
import { Percent, Currency, TradeType } from "@uniswap/sdk-core";
import { useActiveWeb3 } from "contexts/Web3Provider";
import React, { useState } from "react";
import { InterfaceTrade } from "state/routing/types";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { SUPPORTED_GAS_ESTIMATE_CHAIN_IDS } from "constants/chains";
import TradePrice from "./components/TradePrice";
import GasEstimateBadge from "./components/GasEstimateBadge";
import InfoIconOutlined from "@mui/icons-material/InfoOutlined";
import AdvancedSwapDetails from "./components/AdvancedSwapDetails";
import SwapRoute from "./components/SwapRoute";
import RouteDialog from "./components/RouteDialog";

type Props = {
  trade: InterfaceTrade<Currency, Currency, TradeType> | undefined;
  syncing: boolean;
  loading: boolean;
  showInverted: boolean;
  setShowInverted: React.Dispatch<React.SetStateAction<boolean>>;
  allowedSlippage: Percent;
};

const NoWrapTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "transparent",
    maxWidth: "none",
    width: "100%",
  },
});

export default function SwapDetails({
  allowedSlippage,
  loading,
  syncing,
  trade,
  setShowInverted,
  showInverted,
}: Props) {
  const theme = useTheme();
  const { chainId } = useActiveWeb3();
  const [showDetails, setShowDetails] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <Stack>
      <Accordion
        expanded={showDetails}
        onChange={() => setShowDetails(!showDetails)}
      >
        <AccordionSummary disabled={!trade} expandIcon={<ExpandMoreIcon />}>
          <Stack
            width={"100%"}
            alignItems="center"
            direction={"row"}
            justifyContent="space-between"
          >
            <Stack display={"flex"} alignItems={"center"} direction={"row"}>
              {loading || syncing ? (
                <CircularProgress sx={{ mr: 1 }} color="inherit" size={25} />
              ) : (
                <NoWrapTooltip
                  disableHoverListener={showDetails}
                  title={
                    <AdvancedSwapDetails
                      trade={trade}
                      allowedSlippage={allowedSlippage}
                      syncing={syncing}
                    />
                  }
                >
                  <IconButton size="small">
                    <InfoIconOutlined />
                  </IconButton>
                </NoWrapTooltip>
              )}
              {trade ? (
                <TradePrice
                  price={trade.executionPrice}
                  showInverted={showInverted}
                  setShowInverted={setShowInverted}
                />
              ) : loading || syncing ? (
                <Typography>Finding the best route...</Typography>
              ) : null}
            </Stack>

            {!trade?.gasUseEstimateUSD ||
            showDetails ||
            !chainId ||
            !SUPPORTED_GAS_ESTIMATE_CHAIN_IDS.includes(chainId) ? null : (
              <GasEstimateBadge
                trade={trade}
                loading={syncing || loading}
                showRoute={!showDetails}
                disableHover={showDetails}
              />
            )}
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          {trade && (
            <AdvancedSwapDetails
              trade={trade}
              allowedSlippage={allowedSlippage}
              syncing={syncing}
            />
          )}
        </AccordionDetails>
      </Accordion>
      {trade && (
        <Stack
          alignItems={"center"}
          justifyContent={"space-between"}
          direction="row"
          sx={{ mt: showDetails ? 0 : 1 }}
        >
          <Typography variant="subtitle2">Route</Typography>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              setOpen(true);
            }}
          >
            4 steps in the route
          </Button>
        </Stack>
      )}
      <RouteDialog open={open} onClose={() => setOpen(false)} />
    </Stack>
  );
}
