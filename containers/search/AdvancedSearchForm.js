import React, { useState, useEffect } from "react";
import { Formik, Field, Form } from "formik";
import { ToggleButtonGroup } from "formik-material-ui-lab";
import NumberFormat from "react-number-format";
import InputRange from "react-input-range";
import clsx from "clsx";
import { useSelector } from "react-redux";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import ToggleButton from "@material-ui/lab/ToggleButton";

import _get from "lodash/get";
import _isEmpty from "lodash/isEmpty";
import _isEqual from "lodash/isEqual";
import { ALL_FIELD, PRICE_FILED } from "@utils/constants";
import LocationSelect from "@components/LocationSelect";

const useStyles = makeStyles(() => ({
  labelForm: {
    display: "flex",
    alignItems: "center",
    fontFamily: [
      "-apple-system",
      "Noto Sans JP",
      "Noto Serif JP",
      "Open Sans",
      "sans-serif",
    ].join(","),
    fontWeight: "bold",
    marginBottom: "0.75rem",
    "& span": {
      fontSize: "0.875rem",
      marginLeft: "0.25rem",
    },
    "& i": {
      fontSize: "1.5rem",
    },
  },
}));

function valueLabelFormat(value) {
  if (value === PRICE_FILED[1].VALUE) {
    return <span className="price-lable">{PRICE_FILED[1].LABEL}</span>;
  }
  return (
    <NumberFormat
      value={value}
      displayType={"text"}
      prefix={"¥"}
      thousandSeparator
      renderText={(text) => <span className="price-lable">{text}</span>}
    />
  );
}

const AdvancedSearchForm = ({ className, onSubmit, defaultValues }) => {
  const classes = useStyles();
  const dataMenus = useSelector((state) => state.resource.dataMenus.entities);
  const dataMenusIds = useSelector((state) => state.resource.dataMenus.ids);

  const dataSalonTypes = useSelector(
    (state) => state.resource.dataSalonTypes.entities
  );
  const dataSalonTypesIds = useSelector(
    (state) => state.resource.dataSalonTypes.ids
  );

  const [price, setPrice] = useState(
    _get(defaultValues, "price")
      ? defaultValues.price
      : { min: PRICE_FILED[0].VALUE, max: PRICE_FILED[1].VALUE }
  );

  useEffect(() => {
    // set price values when refreshing page
    if (!_isEmpty(defaultValues)) {
      setPrice(defaultValues.price);
    }
  }, [defaultValues]);
  const initalLocation = _get(defaultValues, "location");

  return (
    <div className={`advanced-search-form ${className || ""}`}>
      <Formik
        enableReinitialize
        initialValues={
          _isEmpty(defaultValues)
            ? {
                location: [],
                price: { min: PRICE_FILED[0].VALUE, max: PRICE_FILED[1].VALUE },
                menuCategory: "",
                salonTypes: null,
              }
            : defaultValues
        }
        onSubmit={(values) => {
          const valuesForm = values;
          if (
            (!values.location || values.location.length === 0) &&
            initalLocation
          ) {
            valuesForm.location = initalLocation;
          }
          onSubmit(valuesForm);
        }}
      >
        {(props) => {
          const disabledSubmit =
            (_get(props, "values.location.region") !== ALL_FIELD.id &&
              !_get(props, "values.location.area") &&
              !_get(props, "values.location.station")) ||
            (_get(props, "values.location.region") !== ALL_FIELD.id &&
              _get(props, "values.location.area") &&
              _get(props, "values.location.area").length === 0) ||
            (_get(props, "values.location.region") !== ALL_FIELD.id &&
              !_get(props, "values.location.area") &&
              _isEmpty(_get(props, "values.location.station")));
          return (
            <Form onSubmit={props.handleSubmit}>
              <div className="form-block">
                <Box className="location-box">
                  <Typography className={classes.labelForm}>
                    <i className="icon-location-line" />
                    <span className="text">エリア・駅選択</span>
                  </Typography>
                  <Field
                    name="location"
                    component={LocationSelect}
                    defaultValue={initalLocation}
                    onChange={(evt) => props.setFieldValue("location", evt)}
                  />
                </Box>
                <Box
                  className={clsx("menu-box", {
                    disabled: disabledSubmit,
                  })}
                >
                  <Typography className={classes.labelForm}>
                    <i className="icon-nail" />
                    <span className="text">メニュー選択</span>
                  </Typography>
                  <Field
                    exclusive
                    component={ToggleButtonGroup}
                    name="menuCategory"
                    type="checkbox"
                  >
                    {dataMenusIds.map((menuId) => (
                      <ToggleButton
                        key={menuId}
                        value={menuId}
                        id={menuId}
                        disabled={disabledSubmit}
                      >
                        {dataMenus[menuId].categoryJA}
                      </ToggleButton>
                    ))}
                  </Field>

                  <Box
                    className={clsx("price-box", {
                      disabled: disabledSubmit,
                    })}
                  >
                    <Field
                      className={`price-field ${
                        _isEmpty(_get(props, "values.menuCategory"))
                          ? "hide"
                          : ""
                      }`}
                      name="price"
                      component={InputRange}
                      minValue={PRICE_FILED[0].VALUE}
                      maxValue={PRICE_FILED[1].VALUE}
                      formatLabel={valueLabelFormat}
                      disabled={_isEmpty(_get(props, "values.menuCategory"))}
                      value={price}
                      onChange={(value) => setPrice(value)}
                      onChangeComplete={(value) =>
                        props.setFieldValue("price", value)
                      }
                      step={1000}
                    />
                  </Box>
                </Box>
              </div>
              <Box
                className={clsx("salon-box", {
                  disabled: disabledSubmit,
                })}
              >
                <Typography className={classes.labelForm}>
                  <img src="/assets/images/properties.svg" alt="こだわり設定" />
                  <span className="text">こだわり設定</span>
                </Typography>
                <div className="inner-salon-box">
                  <Field
                    component={ToggleButtonGroup}
                    name="salonTypes"
                    type="checkbox"
                    disabled={disabledSubmit}
                  >
                    {dataSalonTypesIds.length > 0 &&
                      dataSalonTypesIds.map((typeId) => (
                        <ToggleButton
                          key={typeId}
                          value={typeId}
                          id={dataSalonTypes[typeId].name}
                          disableRipple
                          disabled={disabledSubmit}
                        >
                          <div className="images">
                            <img
                              src={_get(dataSalonTypes[typeId], "icons.normal")}
                              alt={dataSalonTypes[typeId].name}
                              className="normal"
                            />
                            <img
                              src={_get(
                                dataSalonTypes[typeId],
                                "icons.selected"
                              )}
                              alt={dataSalonTypes[typeId].name}
                              className="selected"
                            />
                          </div>
                          <span className="salon-type">
                            {dataSalonTypes[typeId].name}
                          </span>
                        </ToggleButton>
                      ))}
                  </Field>
                </div>
              </Box>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                disabled={disabledSubmit}
              >
                検索
              </Button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default React.memo(AdvancedSearchForm, _isEqual);
