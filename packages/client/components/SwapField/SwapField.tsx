import { Paper, Stack, InputBase, Button, Grid } from "@mui/material";
import React, { ChangeEvent } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useState } from "react";

type Props = {};

export default function SwapField({}: Props) {
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (!Number.isNaN(+value)) {
      setText(e.target.value);
    }
  };
  return (
    <Paper
      sx={{
        py: 1,
        ...(isFocused
          ? {
              borderColor: (theme) =>
                theme.palette.mode === "light"
                  ? theme.palette.primary.main
                  : theme.palette.primaryDark.main,
              borderWidth: 2,
            }
          : {
              borderColor: (theme) =>
                theme.palette.mode === "light"
                  ? theme.palette.grey[400]
                  : theme.palette.grey[700],
            }),
        "&:hover": {
          borderColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[900]
              : theme.palette.grey[300],
          borderWidth: "1px solid",
        },
      }}
      variant="outlined"
    >
      <Grid
        // spacing={2}
        alignItems="center"
        justifyContent={"space-between"}
        container
      >
        <Grid item xs={6}>
          <InputBase
            onChange={handleChange}
            placeholder="0.0"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            value={text}
            fullWidth
            sx={{
              ml: 2,
              fontSize: (theme) => theme.typography.h4,
              fontWeight: (theme) => theme.typography.fontWeightSemiBold,
            }}
          />
        </Grid>
        <Grid
          display={"flex"}
          justifyContent={"end"}
          sx={{ mr: 2 }}
          item
          xs={5}
        >
          <Button
            endIcon={<KeyboardArrowDownIcon />}
            // fullWidth
            variant="contained"
          >
            <Stack>Select a token</Stack>
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}
