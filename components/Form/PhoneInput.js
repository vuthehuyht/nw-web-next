import { forwardRef } from "react";
import PropTypes from "prop-types";
import { useField } from "formik";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import ReactPhoneInput from "react-phone-number-input";

const PhoneInput = forwardRef(
  (
    { label, className = "", required, disabled, name, helperText, ...props },
    ref
  ) => {
    const [field, meta, helper] = useField(name);
    const isError = meta.touched && !!meta.error;
    return (
      <Grid
        container
        className={`input-container phone-input-container ${className}`}
        spacing={3}
      >
        <Grid item xs={12} sm={3} lg={2} className="label-container">
          <Typography variant="subtitle1" gutterBottom>
            {label}
            <span className="required">※</span>
          </Typography>
        </Grid>
        <Grid item xs={12} sm={9} lg={6} className="input-item">
          <ReactPhoneInput
            className={`phone-input-underline ${
              isError ? "phone-input-error" : ""
            }`}
            ref={ref}
            {...props}
            {...field}
            onChange={(data) => helper.setValue(data)}
            value={field.value}
            international={false}
            addInternationalOption={false}
            type="tel"
          />
          {isError && <div className="error-message">{meta.error}</div>}
        </Grid>
      </Grid>
    );
  }
);
PhoneInput.displayName = "PhoneInput";

PhoneInput.propTypes = {
  label: PropTypes.string,
  className: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  name: PropTypes.string,
};

export default PhoneInput;
