import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoIconOutlined from "@mui/icons-material/InfoOutlined";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  CircularProgress,
  IconButton,
  Stack,
  styled,
  Typography,
  useTheme,
} from "@mui/material";
import Tooltip, { tooltipClasses, TooltipProps } from "@mui/material/Tooltip";
import { Currency, Percent, TradeType } from "@uniswap/sdk-core";
import { SUPPORTED_GAS_ESTIMATE_CHAIN_IDS } from "constants/chains";
import { useActiveWeb3 } from "contexts/Web3Provider";
import React, { useEffect, useState } from "react";
import { InterfaceTrade } from "state/routing/types";
import { Field } from "state/swap/actions";
import { useDerivedSwapInfo } from "state/swap/hooks";
import AdvancedSwapDetails from "./components/AdvancedSwapDetails";
import GasEstimateBadge from "./components/GasEstimateBadge";
import RouteDialog from "./components/RouteDialog";
import TradePrice from "./components/TradePrice";

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
  const { chainId } = useActiveWeb3();
  const [showDetails, setShowDetails] = useState(false);
  const [open, setOpen] = useState(false);
  const { currencies } = useDerivedSwapInfo();

  const [steps, setSteps] = useState(2);

  // add side effect to component
  useEffect(() => {
    // create interval
    const interval = setInterval(
      () => setSteps(Math.floor(Math.random() * 3 + 1)),
      45000
    );

    // clean up interval on unmount
    return () => {
      clearInterval(interval);
    };
  }, []);

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
            {steps} steps in the route
          </Button>
        </Stack>
      )}
      <RouteDialog
        inputCurrency={currencies[Field.INPUT]}
        outputCurrency={currencies[Field.OUTPUT]}
        steps={steps}
        open={open}
        onClose={() => setOpen(false)}
      />
    </Stack>
  );
}
