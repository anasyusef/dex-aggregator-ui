import { Avatar } from "@mui/material";
import error from "next/error";
import React, { useState } from "react";
import parseIPFSURI from "utils/parseIPFSURI";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import Image, { ImageProps } from "next/image";
import { Currency } from "@uniswap/sdk-core";
import useCurrencyLogoURIs from "hooks/useCurrencyLogoURIs";

type Props = {
  size?: number;
  imageProps?: ImageProps;
  currency?: Currency | null;
};

export default function CurrencyLogo({
  size = 20,
  imageProps,
  currency,
}: Props) {
  const logoURIs = useCurrencyLogoURIs(currency);
  const [error, setError] = useState(false);
  return (
    <Avatar sx={{ height: size, width: size }}>
      {error || !logoURIs[0] ? (
        <QuestionMarkIcon color="disabled" />
      ) : (
        <Image
          {...imageProps}
          layout="fill"
          src={parseIPFSURI(logoURIs[0] ?? "")}
          alt={currency?.symbol}
          onError={() => setError(true)}
        />
      )}
    </Avatar>
  );
}
