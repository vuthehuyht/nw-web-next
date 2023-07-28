import PropTypes from "prop-types";
import _find from "lodash/find";
import _isEmpty from "lodash/isEmpty";
import TextItem from "./TextItem";
import PathItem from "./PathItem";

const LineList = (props) => {
  const { data, handleGoTo, initValue } = props;
  const sortData = Object.entries(data)
    .sort(([, a], [, b]) => a.sortVal - b.sortVal)
    .reduce((acc, [cur, key]) => {
      acc[key.sortVal] = data[cur];
      return acc;
    }, {});

  return (
    <div className="line-list scrollbar">
      {data &&
        Object.keys(sortData).map((key) =>
          sortData[key].numOfNailist > 0 ? (
            <PathItem
              key={sortData[key].objectId}
              id={sortData[key].objectId}
              name={sortData[key].name}
              values={sortData[key].name}
              handleClick={handleGoTo}
              initValue={
                _isEmpty(initValue)
                  ? false
                  : _find(initValue, (item) => item === sortData[key].objectId)
              }
              {...sortData[key]}
            />
          ) : (
            <TextItem
              key={sortData[key].objectId}
              id={sortData[key].objectId}
              name={sortData[key].name}
              values={sortData[key].name}
              initValue={
                _isEmpty(initValue)
                  ? false
                  : _find(initValue, (item) => item === sortData[key].objectId)
              }
              {...sortData[key]}
            />
          )
        )}
    </div>
  );
};

LineList.propTypes = {
  data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  handleGoTo: PropTypes.func,
  initValue: PropTypes.any,
};

export default LineList;
