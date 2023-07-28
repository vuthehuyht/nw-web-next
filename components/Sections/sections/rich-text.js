import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  title: {
    fontFamily: "'Noto Serif JP', serif",
    fontSize: "40px",
    fontWeight: 600,
    margin: "72px 8px 48px",
    textAlign: "center",
  },
}));

const RichText = ({ data }) => {
  const classes = useStyles();

  return (
    <div>
      {/* Title */}
      {data.title && <div className={classes.title}>{data.title}</div>}
      {/* Rich text */}
      <div
        className="ck-content"
        dangerouslySetInnerHTML={{ __html: data.content }}
      />
    </div>
  );
};

export default RichText;
