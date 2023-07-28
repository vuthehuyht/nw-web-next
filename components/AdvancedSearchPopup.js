import { useState, useCallback } from "react";
import { useRouter } from "next/router";
import _get from "lodash/get";
import _isEmpty from "lodash/isEmpty";
import Button from "@material-ui/core/Button";
import { PRICE_FILED, ALL_FIELD } from "@utils/constants";
import SearchForm from "containers/search/AdvancedSearchForm";
import Modal from "@components/Modal";
import HELPER from "@utils/helper";

const AdvancedSearchPopup = () => {
  const [openSearchPopup, setOpenSearchPopup] = useState(false);
  const { replace } = useRouter();

  const onSubmitAdvancedForm = useCallback(
    (values) => {
      let params = {};
      const { location, menuCategory, price, salonTypes } = values;
      // locations
      if (!_isEmpty(location)) {
        if (location.region.id === ALL_FIELD.id) {
          params.region = "all";
        } else {
          params = HELPER.renderLocationUrl(location);
        }
        params.sortBy = "RECOMMEND";
      }

      if (menuCategory) {
        params.menuCategory = menuCategory;
        params.minPrice = _get(price, "min") || PRICE_FILED[0].VALUE;
        if (
          _get(price, "max", 0) > 0 &&
          _get(price, "max") !== PRICE_FILED[1].VALUE
        ) {
          params.maxPrice = _get(price, "max");
        }
      }

      if (salonTypes) {
        params.salonTypes = salonTypes.join(",");
      }
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
      replace({ pathname: "/search", query: HELPER.convertSearchUrl(params) });
    },
    [replace]
  );

  return (
    <div className="advanced-search-popup">
      <Button
        className="advanced-search-button"
        onClick={() => setOpenSearchPopup(true)}
      >
        <div className="search-text-field">
          <i className="icon-search" />
          <span>エリア・駅からネイリストを探す</span>
        </div>
      </Button>

      <Modal
        className="search-dialog modal"
        title="ネイリスト検索"
        maxWidth="md"
        open={openSearchPopup}
        handleClose={setOpenSearchPopup}
      >
        <SearchForm className="search-popup" onSubmit={onSubmitAdvancedForm} />
      </Modal>
    </div>
  );
};

export default AdvancedSearchPopup;
