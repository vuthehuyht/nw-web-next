import { makeStyles } from "@material-ui/core/styles";
import { getBackground } from "utils/background";

const useStyles = makeStyles(() => ({
  root: {
    padding: "40px 0",
    textAlign: "center",
  },
  title: {
    fontSize: "28px",
    fontFamily: "'Senlot'",
  },
  subtitle: {
    fontSize: "24px",
    marginBottom: "16px",
    fontFamily: "'Senlot'",
  },
}));

const StepsSection = ({ data }) => {
  const classes = useStyles();
  const { bottomContent, title, subtitle } = data;

  return (
    <div
      style={{
        ...getBackground(data.backgroundColor),
      }}
      className={classes.root}
    >
      <div className="steps-heading">
        <div className={classes.title}>{title}</div>
        <div className={classes.subtitle}>{subtitle}</div>
      </div>
      {bottomContent && (
        <div className="bottom-content">
          <div
            className="ck-content"
            dangerouslySetInnerHTML={{ __html: bottomContent }}
          />
        </div>
      )}
    </div>
  );
};

export default StepsSection;
