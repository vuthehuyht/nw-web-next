import React, { useState } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      height: "100vh",
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      "& > .MuiCircularProgress-root": {
        width: "60px !important",
        height: "60px !important",
      },
      "& > * + *": {
        marginLeft: "1rem",
      },
    },
  })
);

const LoadingPage = () => {
  const classes = useStyles();
  const [progress, setProgress] = useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 100 ? 0 : prevProgress + 10
      );
    }, 800);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className={classes.root}>
      <CircularProgress variant="static" value={progress} color="secondary" />
    </div>
  );
};

export default LoadingPage;
