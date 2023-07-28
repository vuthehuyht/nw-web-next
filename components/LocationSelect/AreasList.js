import PropTypes from "prop-types";
import _get from "lodash/get";
import _isEmpty from "lodash/isEmpty";
import LocationItem from "./LocationItem";
import TextItem from "./TextItem";

const AreasList = ({ data, handleGoTo, chooseValues }) => (
  <div className="areas-list scrollbar">
    {!_isEmpty(data) &&
      Object.keys(data).map((id) => {
        const nameItem = data[id].wards || `${data[id].name}駅`;

        return _get(data[id], "numOfNailist", 1) > 0 ? (
          <LocationItem
            key={data[id].objectId || data[id].id}
            id={data[id].objectId || data[id].id}
            name={nameItem}
            value={data[id]}
            handleChange={handleGoTo}
            chooseValues={chooseValues}
          />
        ) : (
          <TextItem
            {...data[id]}
            key={data[id].objectId || data[id].id}
            id={data[id].objectId || data[id].id}
            name={nameItem}
            values={data[id].name}
          />
        );
      })}
  </div>
);
AreasList.propTypes = {
  data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  handleGoTo: PropTypes.func,
  initValue: PropTypes.array,
  chooseValues: PropTypes.array,
};

export default AreasList;
