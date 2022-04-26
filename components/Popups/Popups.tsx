import { Stack } from "@mui/material";
import { SupportedChainId } from "constants/chains";
import { useActiveWeb3 } from "contexts/Web3Provider";
import React from "react";
import { useActivePopups } from "state/application/hooks";
import PopupItem from "./PopupItem";

type Props = {};

export default function Popups({}: Props) {
  const activePopups = useActivePopups();

  return (
    <Stack>
      {activePopups
        .slice(0)
        .reverse()
        .map((item) => (
          <PopupItem
            key={item.key}
            content={item.content}
            popKey={item.key}
            removeAfterMs={item.removeAfterMs}
          />
        ))}
    </Stack>
  );
}
