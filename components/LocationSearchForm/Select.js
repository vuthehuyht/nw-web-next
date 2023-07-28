import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import { fieldToTextField } from "formik-material-ui";

const AutoSelect = ({ textFieldProps, options, ...props }) => {
  const {
    form: { setTouched, setFieldValue },
    placeholder,
  } = props;
  const { error, helperText, ...field } = fieldToTextField(props);
  const { name } = field;

  return (
    <Autocomplete
      {...props}
      {...field}
      freeSolo
      disableClearable
      onChange={(_, value) => setFieldValue(name, value)}
      onBlur={() => setTouched({ [name]: true })}
      getOptionLabel={(option) => option.nameCustom}
      renderOption={(option) => (
        <div className="inner-suggest-location">
          <i className="icon-location" />
          <span>{option.nameCustom}</span>
        </div>
      )}
      options={options}
      renderInput={(params) => (
        <div className="inner-text">
          <i className="icon-search" />
          <TextField {...params} variant="outlined" placeholder={placeholder} />
        </div>
      )}
    />
  );
};

export default AutoSelect;
