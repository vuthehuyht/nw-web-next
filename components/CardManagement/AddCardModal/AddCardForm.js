import { useState } from "react";
import { Formik, Form } from "formik";
import dynamic from "next/dynamic";
import PropTypes from "prop-types";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import FormHelperText from "@material-ui/core/FormHelperText";
import Input from "components/Form/TextField";
import Select from "components/Form/SelectField";
import helper from "@utils/helper";
import validationSchema from "./validate";

const AddCardGuideline = dynamic(() => import("../AddCardGuideline"));

const AddCardForm = ({ initialValues, onSubmit }) => {
  const [openGuideline, setOpenGuideline] = useState();
  const currentYear = new Date().getFullYear();

  const handleFormSubmit = (values) => {
    onSubmit(values);
  };

  const handleCloseGuideline = () => {
    setOpenGuideline(false);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      enableReinitialize
      validateOnMount
      onSubmit={handleFormSubmit}
    >
      {({ isValid, handleSubmit, errors, touched }) => (
        <Form>
          <Box marginTop="32px">
            <Input
              name="cardNumber"
              variant="filled"
              type="number"
              label="カード番号"
              required
              smGrid={[4, 8]}
              lgGrid={[4, 8]}
              onInput={(e) => {
                e.target.value = e.target.value.toString().slice(0, 19);
              }}
              placeholder="1234 5678 1234 5678"
            />
            <Box display="flex" marginTop="24px">
              <Grid container className="select-field-container" spacing={3}>
                <Grid item xs={12} sm={4} className="label-container">
                  <Typography variant="subtitle1" gutterBottom>
                    有効期限
                    <span className="required">※</span>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={8} className="input-wrapper">
                  <Box display="flex">
                    <Select
                      options={helper.getMonthValues()}
                      name="cc-exp-month"
                      variant="filled"
                      showError={false}
                      startAdornment={<div className="start-adornment">月</div>}
                    />
                    <div className="slash-container">/</div>
                    <Select
                      name="cc-exp-year"
                      variant="filled"
                      options={helper.getYearValues(
                        currentYear,
                        currentYear + 20
                      )}
                      showError={false}
                      startAdornment={<div className="start-adornment">年</div>}
                    />
                  </Box>
                  <FormHelperText className="Mui-error MuiFormHelperText-contained">
                    {touched.expiredMonth &&
                      touched.expiredYear &&
                      errors.expiredYear}
                  </FormHelperText>
                </Grid>
              </Grid>
            </Box>
            <Box display="flex" marginTop="24px">
              <Grid
                container
                className="input-container text-field-container"
                spacing={3}
              >
                <Grid item xs={12} sm={4} className="label-container">
                  <Typography variant="subtitle1" gutterBottom>
                    セキュリティコード
                    <span className="required">※</span>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={8} className="input-wrapper">
                  <Box display="flex">
                    <Input
                      name="cc-csc"
                      variant="filled"
                      required
                      inputProps={{ pattern: "([^0-9]*)" }}
                      className="security-input"
                      placeholder="123"
                      onInput={(e) => {
                        e.target.value = e.target.value
                          .toString()
                          .slice(0, 4)
                          .replace(/\D/g, "");
                      }}
                    />
                    <Box width="100%" marginLeft="16px">
                      <img src="/assets/images/cards/cvc-card.png" alt="" />
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Box marginTop="24px" className="text-container">
            <Typography color="textPrimary" variant="body2" align="center">
              ※セキュリティコードとは裏面の著名欄に印字されている3桁の番号のことです
            </Typography>
            <Typography
              color="primary"
              align="center"
              onClick={() => setOpenGuideline(true)}
            >
              ※カード決済は施術が終わった後に行われます
            </Typography>
          </Box>
          <Box
            display="flex"
            justifyContent="center"
            marginTop="32px"
            className="btn-container"
          >
            <Button
              disabled={!isValid}
              variant="contained"
              color="secondary"
              onClick={handleSubmit}
            >
              保存
            </Button>
          </Box>
          {openGuideline && (
            <AddCardGuideline
              open={openGuideline}
              onClose={handleCloseGuideline}
            />
          )}
        </Form>
      )}
    </Formik>
  );
};

AddCardForm.propTypes = {
  initialValues: PropTypes.any,
  onSubmit: PropTypes.func.isRequired,
};

export default AddCardForm;
