import {
  createTheme as createLegacyModeTheme,
  ThemeProvider as MuiThemeProvider,
  unstable_createMuiStrictModeTheme as createStrictModeTheme,
} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { unstable_useEnhancedEffect as useEnhancedEffect } from "@mui/material/utils";
import { deepmerge } from "@mui/utils";
import PropTypes from "prop-types";
import * as React from "react";
import { useAppSelector } from "state";
import { selectMode } from "state/user/slice";
import { getDesignTokens, getMetaThemeColor, getThemedComponents } from "theme";

const themeInitialOptions = {
  dense: false,
  direction: "ltr",
  paletteColors: {},
  spacing: 8, // spacing unit
  paletteMode: "light",
};

export const highDensity = {
  components: {
    MuiButton: {
      defaultProps: {
        size: "small",
      },
    },
    MuiFilledInput: {
      defaultProps: {
        margin: "dense",
      },
    },
    MuiFormControl: {
      defaultProps: {
        margin: "dense",
      },
    },
    MuiFormHelperText: {
      defaultProps: {
        margin: "dense",
      },
    },
    MuiIconButton: {
      defaultProps: {
        size: "small",
      },
    },
    MuiInputBase: {
      defaultProps: {
        margin: "dense",
      },
    },
    MuiInputLabel: {
      defaultProps: {
        margin: "dense",
      },
    },
    MuiListItem: {
      defaultProps: {
        dense: true,
      },
    },
    MuiOutlinedInput: {
      defaultProps: {
        margin: "dense",
      },
    },
    MuiFab: {
      defaultProps: {
        size: "small",
      },
    },
    MuiTable: {
      defaultProps: {
        size: "small",
      },
    },
    MuiTextField: {
      defaultProps: {
        margin: "dense",
      },
    },
    MuiToolbar: {
      defaultProps: {
        variant: "dense",
      },
    },
  },
};

export const DispatchContext = React.createContext(() => {
  throw new Error("Forgot to wrap component in `ThemeProvider`");
});

if (process.env.NODE_ENV !== "production") {
  DispatchContext.displayName = "ThemeDispatchContext";
}

let createTheme: any;
if (process.env.REACT_STRICT_MODE) {
  createTheme = createStrictModeTheme;
} else {
  createTheme = createLegacyModeTheme;
}

export default function ThemeProvider(props: any) {
  const { children } = props;
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const preferredMode = prefersDarkMode ? "dark" : "light";
  const themeMode = useAppSelector(selectMode) || preferredMode;

  // const userLanguage = useUserLanguage();
  const { dense, paletteColors, paletteMode, spacing } = {
    ...themeInitialOptions,
    paletteMode: themeMode ?? "dark",
  };

  React.useEffect(() => {
    const metas = document.querySelectorAll('meta[name="theme-color"]');
    metas.forEach((meta) => {
      meta.setAttribute("content", getMetaThemeColor(themeMode));
    });
  }, [themeMode]);

  const theme = React.useMemo(() => {
    const brandingDesignTokens = getDesignTokens(paletteMode);
    const nextPalette = deepmerge(brandingDesignTokens.palette, paletteColors);
    let nextTheme = createTheme(
      {
        ...brandingDesignTokens,
        palette: {
          ...nextPalette,
          mode: paletteMode,
        },
        // v5 migration
        props: {
          MuiBadge: {
            overlap: "rectangular",
          },
        },
        spacing,
      },
      dense ? highDensity : null,
      {
        components: {
          MuiCssBaseline: {
            defaultProps: {
              enableColorScheme: true,
            },
          },
        },
      }
    );

    nextTheme = deepmerge(nextTheme, getThemedComponents(nextTheme));

    return nextTheme;
  }, [dense, paletteColors, paletteMode, spacing]);

  useEnhancedEffect(() => {
    if (theme.palette.mode === "dark") {
      document.body.classList.remove("mode-light");
      document.body.classList.add("mode-dark");
    } else {
      document.body.classList.remove("mode-dark");
      document.body.classList.add("mode-light");
    }
  }, [themeMode]);

  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
}

ThemeProvider.propTypes = {
  children: PropTypes.node,
};
