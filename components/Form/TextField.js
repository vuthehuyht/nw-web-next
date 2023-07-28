import { forwardRef } from "react";
import PropTypes from "prop-types";
import { useField } from "formik";
import MuiTextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import InputAdornment from "@material-ui/core/InputAdornment";

const TextInput = forwardRef(
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
      endAdornment,
      showError = true,
      ...props
    },
    ref
  ) => {
    const [field, meta] = useField(name);
    const isError = meta.touched && !!meta.error;
    const error = showError ? meta.error : null;
    return (
      <Grid
        container
        className={`input-container text-field-container ${className}`}
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
          <MuiTextField
            error={isError}
            helperText={isError ? error : helperText}
            {...props}
            {...field}
            disabled={disabled}
            InputProps={{
              startAdornment: startAdornment ? (
                <InputAdornment position="start">
                  {startAdornment}
                </InputAdornment>
              ) : null,
              endAdornment: endAdornment ? (
                <InputAdornment position="end">{endAdornment}</InputAdornment>
              ) : null,
            }}
            value={field.value || ""}
            ref={ref}
          />
        </Grid>
      </Grid>
    );
  }
);
TextInput.displayName = "TextInput";

TextInput.propTypes = {
  label: PropTypes.string,
  className: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  name: PropTypes.string,
  lgGrid: PropTypes.array,
  smGrid: PropTypes.array,
  showError: PropTypes.bool,
};

export default TextInput;
