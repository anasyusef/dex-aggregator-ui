import * as React from "react";
import Head from "next/head";
import { AppProps } from "next/app";
import { createTheme } from "@mui/material/styles";
import { MulticallUpdater, PopupItem, ThemeProvider } from "components";
import {
  IconButton,
  ThemeProvider as MuiThemeProvider,
  useTheme,
} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { Provider, useStore } from "react-redux";
import store, { RootState, useAppDispatch, useAppSelector } from "state";
import createEmotionCache from "createEmotionCache";
import { selectMode, setMode } from "state/user/slice";
import { Button, PaletteMode } from "@mui/material";
import { deepmerge } from "@mui/utils";
import { getDesignTokens, getThemedComponents } from "theme";
import TransactionUpdater from "state/transactions/updater";
import Web3Provider from "contexts/Web3Provider";
import { ReactNode } from "react";
import { BlockNumberProvider } from "hooks/useBlockNumber";
// import { getDesignTokens, getThemedComponents } from "theme";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

function BrandingProvider({ children }: { children: ReactNode }) {
  const themeMode = useAppSelector(selectMode) ?? "light";
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: themeMode,
        },
      }),
    [themeMode]
  );
  const dispatch = useAppDispatch();
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  return (
    <Provider store={store}>
      <CacheProvider value={emotionCache}>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <Web3Provider>
          <BlockNumberProvider>
            <ThemeProvider>
              <CssBaseline />
              <Component {...pageProps} />
              <MulticallUpdater />
              <TransactionUpdater />
            </ThemeProvider>
          </BlockNumberProvider>
        </Web3Provider>
      </CacheProvider>
    </Provider>
  );
}
