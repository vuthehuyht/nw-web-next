import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import Link from "next/link";

const useStyles = makeStyles(() => ({
  root: {
    marginTop: "0.75rem",
    marginBottom: "0.75rem",
    "& li > a": {
      color: "#aaa",
      fontFamily: "Noto Sans JP, Noto Serif JP, Open Sans, sans-serif",
      fontWeight: "bold",
      fontSize: "0.75rem",
    },
    "& li > p": {
      color: "#aaa",
      fontFamily: "Noto Sans JP, Noto Serif JP, Open Sans, sans-serif",
    },
    "& li:last-child": {
      // width: '80%',

      "& > p": {
        // width: '95%',
        textOverflow: "ellipsis",
        overflow: "hidden",
        whiteSpace: "nowrap",
        fontSize: "0.75rem",
      },
    },
  },
}));

const CustomeBreadcrumbs = ({ data, className, loading = false }) => {
  const classes = useStyles();

  return (
    <Container className={`${classes.root} ${className || ""}`}>
      <Breadcrumbs
        separator="›"
        aria-label="breadcrumb"
        className="breadcrumbs"
      >
        <Link color="inherit" href="/">
          <a>トップ</a>
        </Link>
        {!loading &&
          data &&
          data.length &&
          data.map((item) =>
            item.href ? (
              <Link key={item.text} color="inherit" href={item.href}>
                <a>{item.text}</a>
              </Link>
            ) : (
              <Typography key={item.text}>{item.text}</Typography>
            )
          )}
        {loading && (
          <Typography key="loading">
            <CircularProgress size={20} />
          </Typography>
        )}
      </Breadcrumbs>
    </Container>
  );
};

export default CustomeBreadcrumbs;
