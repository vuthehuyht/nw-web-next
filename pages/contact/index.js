import { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Container, Button, Grid, Typography } from "@material-ui/core";
import { TextField } from "formik-material-ui";
import { postQuestionSupportTicket } from "providers/policy-actions";
import Title from "@components/Title";
import Layout from "components/Layout";
import ThankYouBlock from "components/Thankyou";
import { VALIDATION_TEXT } from "utils/constants";

const ContactPage = () => {
  const [successContact, setSuccessContact] = useState(null);

  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required(VALIDATION_TEXT.REQUIRED),
    email: Yup.string()
      .required(VALIDATION_TEXT.REQUIRED)
      .email(VALIDATION_TEXT.EMAIL_FORMAT),
    question: Yup.string().required(VALIDATION_TEXT.REQUIRED),
  });

  const handleSubmit = (values) => {
    postQuestionSupportTicket(values)
      .then((result) => {
        if (result.status && result.status === "error") {
          return;
        }
        setSuccessContact(result);
      })
      .catch((e) => {
        console.log("error: ", e);
      });
  };

  return (
    <Layout>
      <Container className="static-page contact-wrapper" maxWidth="md">
        {successContact ? (
          <ThankYouBlock className="contact-block contact--thankyou" />
        ) : (
          <div className="contact-block contact--form">
            <Title
              title="Contact Us"
              japanese="お問い合わせ"
              className="static-title"
              positionClass="center"
            />
            <div className="inner-block">
              <Formik
                initialValues={{
                  fullName: "",
                  email: "",
                  phone: null,
                  question: "",
                }}
                validationSchema={validationSchema}
                validateOnChange={false}
                validateOnBlur={false}
                onSubmit={(values, { setSubmitting }) => {
                  setSubmitting(true);
                  handleSubmit(values);
                }}
              >
                {() => (
                  <Form>
                    <Grid spacing={3} container>
                      <Grid item xs={12} sm={3}>
                        <Typography variant="subtitle1" gutterBottom>
                          名前
                          <span className="required">※</span>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={9}>
                        <Field
                          component={TextField}
                          name="fullName"
                          variant="filled"
                          type="text"
                          placeholder="名前"
                        />
                      </Grid>

                      <Grid item xs={12} sm={3}>
                        <Typography variant="subtitle1" gutterBottom>
                          メールアドレス
                          <span className="required">※</span>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={9}>
                        <Field
                          component={TextField}
                          name="email"
                          variant="filled"
                          type="email"
                          placeholder="メールアドレス"
                        />
                      </Grid>

                      <Grid item xs={12} sm={3}>
                        <Typography variant="subtitle1" gutterBottom>
                          電話番号
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={9}>
                        <Field
                          component={TextField}
                          name="phone"
                          type="text"
                          variant="filled"
                          placeholder="電話番号"
                        />
                      </Grid>

                      <Grid item xs={12} sm={3}>
                        <Typography variant="subtitle1" gutterBottom>
                          お問い合わせ内容
                          <span className="required">※</span>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={9}>
                        <Field
                          component={TextField}
                          name="question"
                          multiline
                          rows="5"
                          variant="filled"
                          placeholder="お問い合わせ内容"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
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
        )}
      </Container>
    </Layout>
  );
};

export default ContactPage;
