import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

declare module "@mui/material/styles" {
  interface Palette {
    white: Palette["primary"];
  }

  interface PaletteOptions {
    white?: PaletteOptions["primary"];
  }
}

// Update the Button's color options to include an white option
declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    white: true;
  }
}

// A custom theme for this app
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#00A39C",
    },
    secondary: {
      main: "#333f48",
    },
    error: {
      main: red.A400,
    },
    white: {
      main: "#ffffff",
      light: "#ffffff",
      dark: "#ffffff",
    },
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          variants: [
            {
              props: { variant: "body1" },
              style: {
                fontSize: "1.2rem",
                textAlign: "center",
                color: "#30d4c9", // find a way to fix this
              },
            },
            {
              props: { variant: "h3" },
              style: {
                fontSize: "4rem",
                fontWeight: "bold",
                textAlign: "center",
                color: "#00A39C", // find a way to fix this
              },
            },
          ],
        },
      },
    },
  },
});

export default theme;
