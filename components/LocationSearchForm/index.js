import { Formik, Field, Form } from "formik";
import { Button } from "@material-ui/core";
import AutoSelect from "./Select";

const LocationSearchForm = ({ onSubmit, options }) => (
  <Formik
    initialValues={{ location: "" }}
    onSubmit={(values) => {
      onSubmit(values);
    }}
  >
    {(props) => (
      <Form onSubmit={props.handleSubmit}>
        <Field
          type="select"
          name="location"
          placeholder="ネイリスト検索"
          component={AutoSelect}
          options={options}
        />
        <Button type="submit" variant="contained" color="primary">
          検索
        </Button>
      </Form>
    )}
  </Formik>
);

export default LocationSearchForm;
