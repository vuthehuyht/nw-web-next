import { makeStyles, withStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputBase from "@material-ui/core/InputBase";

const BootstrapInput = withStyles((theme) => ({
  input: {
    borderRadius: 4,
    position: "relative",
    backgroundColor: "#fff",
    border: "1px solid #484848",
    fontSize: 14,
    padding: "14px 16px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    fontFamily: [
      "-apple-system",
      "Noto Sans JP",
      "Noto Serif JP",
      "Open Sans",
      "sans-serif",
    ].join(","),
    "&:focus": {
      borderRadius: 4,
      borderColor: "#e5004e",
      backgroundColor: "#fff",
      boxShadow: "0 0 0 0.2rem rgba(229,0,78,.25)",
    },
  },
}))(InputBase);

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
  menuItem: {
    fontSize: 14,
    padding: "0.875rem 1rem",

    "&.Mui-selected": {
      color: "#fff",
      background: "#e5004e",
    },
  },
}));

const CustomizedSelects = (props) => {
  const classes = useStyles();

  return (
    <FormControl variant="outlined">
      <InputLabel shrink htmlFor="select-helper" className="text-field-label">
        {props.label}
      </InputLabel>
      <Select
        value={props.value || props.defaultValue}
        onChange={props.onChange}
        inputProps={{
          name: props.name,
          id: "select-helper",
        }}
        input={<BootstrapInput />}
      >
        {props.options.map((param) => (
          <MenuItem
            key={param.value}
            value={param.value}
            className={classes.menuItem}
          >
            {param.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CustomizedSelects;
