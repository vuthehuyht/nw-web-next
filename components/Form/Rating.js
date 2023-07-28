import PropTypes from "prop-types";
import { useField } from "formik";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Rating from "@material-ui/lab/Rating";
import Box from "@material-ui/core/Box";

const StarRating = ({ label, className = "", name }) => {
  const [field, , helper] = useField(name);

  const handleChange = (e, newValue) => {
    if (newValue) {
      helper.setValue(newValue);
    }
  };

  return (
    <Grid
      container
      className={`star-rating-container ${className}`}
      spacing={3}
    >
      <Grid item xs={2} sm={3} lg={3} className="label-container">
        <Typography variant="subtitle1" gutterBottom>
          {label}
        </Typography>
      </Grid>
      <Grid item xs={10} sm={6} lg={6} className="input-item">
        <Rating
          name={name}
          value={field.value}
          icon={<i className="icon-big-star" />}
          emptyIcon={<i className="icon-outline-star" />}
          onChange={handleChange}
          max={5}
        />
        <Box display="flex" justifyContent="space-between">
          <Typography variant="subtitle2">悪い</Typography>
          <Typography variant="subtitle2">良い</Typography>
        </Box>
      </Grid>
    </Grid>
  );
};
StarRating.displayName = "StarRating";

StarRating.propTypes = {
  label: PropTypes.string,
  className: PropTypes.string,
  name: PropTypes.string,
};

export default StarRating;
