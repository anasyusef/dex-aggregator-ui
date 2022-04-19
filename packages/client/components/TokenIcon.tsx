import { Avatar } from "@mui/material";
import error from "next/error";
import React, { useState } from "react";
import parseIPFSURI from "utils/parseIPFSURI";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import Image, { ImageProps } from "next/image";

type Props = {
  size?: number;
  imageProps?: ImageProps;
  logoURI?: string;
  symbol?: string;
};

export default function TokenIcon({
  size = 20,
  imageProps,
  logoURI,
  symbol,
}: Props) {
  const [error, setError] = useState(false);
  return (
    <Avatar sx={{ height: size, width: size }}>
      {error || !logoURI ? (
        <QuestionMarkIcon color="disabled" />
      ) : (
        <Image
          {...imageProps}
          layout="fill"
          src={parseIPFSURI(logoURI ?? "")}
          alt={symbol}
          onError={() => setError(true)}
        />
      )}
    </Avatar>
  );
}
