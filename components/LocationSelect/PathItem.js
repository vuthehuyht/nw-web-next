import PropTypes from "prop-types";
import { Badge, Button } from "@material-ui/core";
// import iconCheck from 'images/icons/check.svg';

const PathItem = (props) => {
  const { name, id, handleClick, initValue, values } = props;

  return (
    <Button
      className="location-item location-item--button"
      onClick={() => handleClick({ id, name, values, ...props })}
    >
      <Badge
        overlap="rectangular"
        className="badge"
        invisible={!initValue || (initValue && id !== initValue)}
        badgeContent={<img src="/assets/images/check.svg" alt="check" />}
      >
        {name}
      </Badge>
    </Button>
  );
};

PathItem.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  handleClick: PropTypes.func,
  initValue: PropTypes.any,
  values: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
};

export default PathItem;
