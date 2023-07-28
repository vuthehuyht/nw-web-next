import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Button, Grid, Typography } from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import { TextField } from "formik-material-ui";

const SUB_TYPES = {
  INFORMATION: "サロンマネージャーの詳細を知りたい",
  REQUEST: "サロンマネージャーを利用申請したい",
};

const SalonContactPage = ({ onSubmit }) => {
  const validationSchema = Yup.object().shape({
    salonName: Yup.string().required("必須"),
    fullName: Yup.string().required("必須"),
    email: Yup.string()
      .required("必須")
      .email("メールアドレスを入力してください（例。----@----.com）"),
    phone: Yup.string().required("必須"),
    subType: Yup.string().required("必須"),
  });

  const handleSubmit = (values) => {
    onSubmit(values);
  };

  const initialValue = {
    salonName: "",
    fullName: "",
    email: "",
    phone: "",
    question: "",
    subType: "",
    salonURL: "",
  };

  return (
    <div className="salon-contact-form">
      <div className="inner-block">
        <Formik
          initialValues={initialValue}
          validationSchema={validationSchema}
          validateOnBlur={false}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            const submitValues = values;
            const { question, subType } = values;
            if (question === "") {
              submitValues.question = SUB_TYPES[subType];
            }
            setSubmitting(true);
            handleSubmit(submitValues);
            resetForm(initialValue);
          }}
        >
          {({ status }) => (
            <Form success={!!status && !!status.success}>
              <Grid spacing={3} container>
                <Grid item xs={12} sm={3}>
                  <Typography variant="body2" gutterBottom>
                    <span className="requied_txt">必須</span>会社 / 店舗名
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={9}>
                  <Field
                    component={TextField}
                    name="salonName"
                    variant="outlined"
                    type="text"
                    placeholder="会社 / 店舗名"
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <Typography variant="body2" gutterBottom>
                    <span className="requied_txt">必須</span>ご担当者様名
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={9}>
                  <Field
                    component={TextField}
                    name="fullName"
                    variant="outlined"
                    type="text"
                    placeholder="ご担当者様名"
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <Typography variant="body2" gutterBottom>
                    <span className="requied_txt">必須</span>メールアドレス
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={9}>
                  <Field
                    component={TextField}
                    name="email"
                    variant="outlined"
                    type="email"
                    placeholder="メールアドレス"
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <Typography variant="body2" gutterBottom>
                    <span className="requied_txt">必須</span>電話番号
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={9}>
                  <Field
                    component={TextField}
                    name="phone"
                    type="text"
                    variant="outlined"
                    placeholder="電話番号"
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <Typography variant="body2" gutterBottom>
                    サロンのURL
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={9}>
                  <Field
                    component={TextField}
                    name="salonURL"
                    type="text"
                    variant="outlined"
                    placeholder="サロンのURL"
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <Typography variant="body2" gutterBottom>
                    <span className="requied_txt">必須</span>お問い合わせ内容
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={9}>
                  <Field
                    component={TextField}
                    type="text"
                    name="subType"
                    select
                    variant="outlined"
                    defaultValue="REQUEST"
                  >
                    <MenuItem value="REQUEST">
                      サロンマネージャーを利用申請したい
                    </MenuItem>
                    <MenuItem value="INFORMATION">
                      サロンマネージャーの詳細を知りたい
                    </MenuItem>
                  </Field>
                </Grid>

                <Grid item xs={12} sm={3}>
                  <Typography variant="body2" gutterBottom>
                    ご質問・ご要望
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={9}>
                  <Field
                    component={TextField}
                    name="question"
                    multiline
                    rows="5"
                    variant="outlined"
                    placeholder="ご質問・ご要望"
                  />
                </Grid>
                <Grid item xs={12} className="btn-row">
                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    className="btn-submit"
                  >
                    <span>送信</span>
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SalonContactPage;
