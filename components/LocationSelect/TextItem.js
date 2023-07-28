import PropTypes from "prop-types";
import { Badge, Typography } from "@material-ui/core";
// import iconCheck from 'images/icons/check.svg';

const TextItem = (props) => {
  const { name, id, initValue, className } = props;

  return (
    <Typography
      className={`location-item location-item--button ${className || ""}`}
    >
      <Badge
        overlap="rectangular"
        className="badge"
        invisible={!initValue || (initValue && id !== initValue)}
        badgeContent={<img src="/assets/images/check.svg" alt="check" />}
      >
        {name}
      </Badge>
    </Typography>
  );
};

TextItem.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  initValue: PropTypes.any,
  className: PropTypes.string,
  values: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
};

export default TextItem;
