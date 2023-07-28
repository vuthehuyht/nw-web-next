import { Form } from "formik";
import PropTypes from "prop-types";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Input from "components/Form/TextField";

const UserInformationForm = ({ showSubmitBtn, onSubmit, isValid }) => (
  <Form>
    <Box>
      <Box display="flex" className="input-box">
        <Grid
          container
          className="input-container text-field-container"
          spacing={3}
        >
          <Grid item xs={12} sm={4} className="label-container">
            <Typography variant="subtitle1" gutterBottom>
              姓名
              <span className="required">※</span>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={8} className="input-wrapper">
            <Box display="flex">
              <Input
                name="fullName"
                variant="filled"
                type="text"
                required
                placeholder="鈴木 ネイル"
                inputProps={{
                  maxLength: 30,
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box display="flex" className="input-box">
        <Grid
          container
          className="input-container text-field-container"
          spacing={3}
        >
          <Grid item xs={12} sm={4} className="label-container">
            <Typography variant="subtitle1" gutterBottom>
              ふりがな
              <span className="required">※</span>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={8} className="input-wrapper">
            <Box display="flex">
              <Input
                name="furigana"
                variant="filled"
                type="text"
                required
                placeholder="すずき ねいる"
                inputProps={{
                  maxLength: 30,
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box display="flex" className="input-box">
        <Grid
          container
          className="input-container text-field-container"
          spacing={3}
        >
          <Grid item xs={12} sm={4} className="label-container">
            <Typography variant="subtitle1" gutterBottom>
              携帯番号
              <span className="required">※</span>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={8} className="input-wrapper">
            <Box display="flex">
              <Input
                name="phone"
                variant="filled"
                type="number"
                required
                disabled
                smGrid={[4, 8]}
                lgGrid={[4, 8]}
                placeholder="08012345678"
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
    {showSubmitBtn && (
      <Box display="flex" justifyContent="center" className="btn-container">
        <Button
          disabled={!isValid}
          variant="contained"
          color="secondary"
          onClick={onSubmit}
        >
          保存
        </Button>
      </Box>
    )}
  </Form>
);

UserInformationForm.propTypes = {
  initialValues: PropTypes.any,
  onSubmit: PropTypes.func.isRequired,
};

export default UserInformationForm;
