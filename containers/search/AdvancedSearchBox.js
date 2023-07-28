import _get from "lodash/get";
import _isEmpty from "lodash/isEmpty";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { NO_CHOOSE } from "utils/constants";

export default function AdvancedSearchBox({
  locations,
  menuCategory,
  salonTypes,
  clickFunction,
}) {
  const locationTxt = _get(locations, "region.name")
    ? _get(locations, "region.name")
    : locations;

  return (
    <div className="advanced-search-box">
      <div className="inner-advanced-search">
        <Typography>
          <i className="icon-location-line" />
          <span>{!_isEmpty(locationTxt) ? locationTxt : NO_CHOOSE}</span>
        </Typography>

        <Typography>
          <i className="icon-nail" />
          <span>
            {!_isEmpty(menuCategory)
              ? _get(menuCategory, "categoryJA")
              : NO_CHOOSE}
          </span>
        </Typography>

        <Typography>
          <img src="/assets/images/properties.svg" alt="こだわり設定" />
          <span>{!_isEmpty(salonTypes) ? salonTypes : NO_CHOOSE}</span>
        </Typography>
      </div>
      <div className="btn-control">
        <Button color="secondary" onClick={clickFunction}>
          <span>検索条件</span>
        </Button>
      </div>
    </div>
  );
}
