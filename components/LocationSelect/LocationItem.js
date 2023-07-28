import PropTypes from "prop-types";
import Badge from "@material-ui/core/Badge";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import _find from "lodash/find";
import _isEmpty from "lodash/isEmpty";

const LocationItem = (props) => {
  const { id, name, initValue, handleChange, chooseValues, className, value } =
    props;
  return (
    <div className={`location-item location-item--checkbox ${className || ""}`}>
      <Badge
        overlap="rectangular"
        className="badge"
        invisible={_isEmpty(_find(initValue, (o) => o === id))}
        badgeContent={<img src="/assets/images/check.svg" alt="check" />}
      >
        <FormControlLabel
          label={name}
          control={
            <Checkbox
              onChange={() => handleChange(value)}
              checked={(chooseValues || []).includes(id)}
              name={name}
              color="default"
            />
          }
        />
      </Badge>
    </div>
  );
};

LocationItem.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  handleChange: PropTypes.func,
  initValue: PropTypes.array,
  chooseValues: PropTypes.array,
  value: PropTypes.any,
};

export default LocationItem;
