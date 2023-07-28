import PropTypes from "prop-types";
import PathItem from "./PathItem";

const RegionList = (props) => {
  const { handleGoTo, initValue, data, ids = [] } = props;
  return (
    <div className="region-list">
      {ids.map((id) => (
        <PathItem
          key={id}
          id={id}
          name={data[id].region}
          values={data[id].prefectures}
          handleClick={handleGoTo}
          initValue={initValue}
        />
      ))}
    </div>
  );
};

RegionList.propTypes = {
  data: PropTypes.array,
  handleGoTo: PropTypes.func,
  initValue: PropTypes.any,
  ids: PropTypes.array,
};

export default RegionList;
