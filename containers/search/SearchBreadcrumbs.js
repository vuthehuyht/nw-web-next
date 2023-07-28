import { memo } from "react";
import _isEmpty from "lodash/isEmpty";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import Link from "next/link";

function ItemBreadcrumbs(prop) {
  if (!_isEmpty(prop.text)) {
    return prop.href ? (
      <Link key={prop.text} color="inherit" href={prop.href}>
        {prop.text}
      </Link>
    ) : (
      <Typography key={prop.text}>{prop.text}</Typography>
    );
  }
  return <CircularProgress size={20} />;
}

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

const SearchBreadcrumbs = ({ breadcrumbs = [] }) => {
  const classes = useStyles();

  return (
    <div className="search-breadcrumbs">
      <Container className={classes.root}>
        <Breadcrumbs
          separator="›"
          aria-label="breadcrumb"
          className="breadcrumbs"
        >
          <Link color="inherit" href="/">
            <a>トップ</a>
          </Link>
          {breadcrumbs.map((bread, index) => (
            <ItemBreadcrumbs
              key={bread.text}
              text={bread.text}
              href={index !== breadcrumbs.length - 1 ? bread.href : ""}
            />
          ))}
        </Breadcrumbs>
      </Container>
    </div>
  );
};

export default memo(SearchBreadcrumbs);
