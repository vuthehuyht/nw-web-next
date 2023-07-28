import { createTheme } from "@material-ui/core/styles";

const typoObjectStyle = () => {
  const typoStyle = {};
  [
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "subtitle1",
    "subtitle2",
    "body1",
    "body2",
    "caption",
    "overline",
  ].forEach((type) => {
    typoStyle[type] = {};
    typoStyle[type].lineHeight = "normal";
  });
  return typoStyle;
};
// A custom theme for this app
const theme = createTheme({
  palette: {
    primary: {
      main: "#009193",
    },
    secondary: {
      light: "#ec467e",
      main: "#e50250",
      dark: "#a00036",
    },
    text: {
      primary: "#484848",
      secondary: "#858585",
      white: "#aaa",
    },
    background: {
      default: "#fff",
      paper: "#f4f4f4",
    },
  },
  typography: {
    button: {
      textTransform: "none",
      lineHeight: "normal",
    },
    ...typoObjectStyle(),
    fontFamily: [
      "Noto Sans JP",
      "Noto Serif JP",
      "Open Sans",
      "sans-serif",
    ].join(","),
  },
  overrides: {
    MuiDialog: {
      paper: {
        backgroundColor: "#fff",
        margin: 16,
      },
      paperWidthMd: {
        maxWidth: "914px",
        width: "100%",
      },
    },
    MuiButton: {
      root: {
        padding: "14px",
      },
    },
  },
});

export default theme;
