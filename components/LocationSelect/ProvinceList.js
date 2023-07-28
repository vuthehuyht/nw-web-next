import PropTypes from "prop-types";
import PathItem from "./PathItem";

const ProvinceList = (props) => {
  const { data = {}, handleGoTo, initValue } = props;
  return (
    <div className="province-list">
      {Object.keys(data).map((provinceId) => (
        <PathItem
          key={provinceId}
          id={provinceId}
          name={data[provinceId].province}
          values={data[provinceId].areas}
          handleClick={handleGoTo}
          initValue={initValue}
          {...data[provinceId]}
        />
      ))}
    </div>
  );
};

ProvinceList.propTypes = {
  data: PropTypes.array,
  handleGoTo: PropTypes.func,
  initValue: PropTypes.any,
};

export default ProvinceList;
