import { forwardRef } from "react";
import PropTypes from "prop-types";
import { useField } from "formik";
import MuiSelectField from "@material-ui/core/Select";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import InputAdornment from "@material-ui/core/InputAdornment";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";

const SelectField = forwardRef(
  (
    {
      label,
      className = "",
      required,
      disabled,
      name,
      helperText,
      smGrid = [3, 9],
      lgGrid = [3, 9],
      startAdornment,
      showError = true,
      options = [],
      ...props
    },
    ref
  ) => {
    const [field, meta] = useField(name);
    const isError = meta.touched && !!meta.error;

    return (
      <Grid
        container
        className={`select-field-container ${className}`}
        spacing={3}
      >
        {label && (
          <Grid
            item
            xs={12}
            sm={smGrid[0]}
            lg={lgGrid[0]}
            className="label-container"
          >
            <Typography variant="subtitle1" gutterBottom>
              {label}
              {required && <span className="required">※</span>}
            </Typography>
          </Grid>
        )}
        <Grid
          item
          xs={12}
          sm={label ? smGrid[1] : 12}
          lg={label ? lgGrid[1] : 12}
          className="input-item"
        >
          <FormControl error>
            <MuiSelectField
              error={isError}
              {...props}
              {...field}
              value={field.value || ""}
              ref={ref}
              startAdornment={
                startAdornment ? (
                  <InputAdornment position="start">
                    {startAdornment}
                  </InputAdornment>
                ) : null
              }
              IconComponent={() => <i className="icon-angle-down" />}
            >
              {options.map((param) => (
                <MenuItem key={param.value} value={param.value}>
                  {param.name}
                </MenuItem>
              ))}
            </MuiSelectField>
            {showError && isError && (
              <FormHelperText>{meta.error}</FormHelperText>
            )}
          </FormControl>
        </Grid>
      </Grid>
    );
  }
);

SelectField.displayName = "SelectField";

SelectField.propTypes = {
  label: PropTypes.string,
  className: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  name: PropTypes.string,
  lgGrid: PropTypes.array,
  smGrid: PropTypes.array,
  showError: PropTypes.bool,
};

export default SelectField;
