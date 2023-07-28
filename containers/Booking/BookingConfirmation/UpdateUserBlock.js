import { memo, useState } from "react";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import dynamic from "next/dynamic";
import { Formik } from "formik";
import moment from "moment";
import UserInformationForm from "containers/Booking/BookingConfirmation/UserInformationForm";
import validationSchema from "./validate";

const CancelPolicyModal = dynamic(() => import("./CancelPolicyModal"));
const UserInformationModal = dynamic(() =>
  import("containers/Booking/BookingConfirmation/UserInformationModal")
);

const UpdateUserBlock = ({
  hasBooking,
  fullName,
  phonetic: furigana,
  phone,
  updateUserInfo,
  data,
  nailistAvatar,
  nailistUsername,
  cancelDate,
  onSubmit,
  defaultCard,
  isDirectBooking,
}) => {
  const [openUserInformationModal, setOpenUserInformationModal] =
    useState(false);
  const [openPolicyModal, setOpenPolicyModal] = useState(false);

  return (
    <Formik
      initialValues={{ fullName, furigana, phone }}
      validationSchema={validationSchema}
      enableReinitialize
      validateOnMount
      onSubmit={onSubmit}
    >
      {({ isValid, handleSubmit, values, resetForm }) => (
        <>
          {hasBooking ? (
            <div className="update-user-block">
              <Box width="100%" className="inner-update-user-block">
                <Typography>お客様情報</Typography>
                <UserInformationForm
                  initialValues={{ fullName, furigana, phone }}
                />
              </Box>
            </div>
          ) : (
            <Button
              className="update-user-block"
              onClick={() => {
                setOpenUserInformationModal(true);
              }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                width="100%"
              >
                <Typography>お客様情報</Typography>
                <div>
                  <Typography variant="subtitle2">
                    {fullName} ({furigana})
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    className="user-phone"
                    align="right"
                  >
                    {phone}
                  </Typography>
                </div>
              </Box>
            </Button>
          )}
          {openUserInformationModal && (
            <UserInformationModal
              open={openUserInformationModal}
              onClose={() => {
                resetForm();
                setOpenUserInformationModal(false);
              }}
              onSubmit={() => updateUserInfo(values)}
              isValid={isValid}
            />
          )}
          <div className="cancel-policy-block">
            {cancelDate && (
              <Box
                display="flex"
                justifyContent="space-between"
                className="cancel-date-container"
              >
                <Typography variant="subtitle2">キャンセル料発生日</Typography>
                <Typography variant="subtitle2">
                  {moment(cancelDate, "YYYY-MM-DD").format("YYYY/MM/DD")}
                </Typography>
              </Box>
            )}
            <Typography variant="subtitle2" className="">
              キャンセルポリシー: ボタンをタップして予約を送信することによ
              り、こちらのネイリストの
              <span
                className="highlight-text"
                onClick={() => setOpenPolicyModal(true)}
              >
                キャンセルポリシーに同意したものとみ なされます
              </span>
            </Typography>
            <Box
              display="flex"
              justifyContent="center"
              marginTop="32px"
              className="btn-container"
            >
              <Button
                variant="contained"
                color="secondary"
                disabled={!defaultCard || !isValid}
                onClick={handleSubmit}
              >
                {isDirectBooking ? "予約を確定する" : "予約リクエスト"}
              </Button>
            </Box>
            {openPolicyModal && (
              <CancelPolicyModal
                data={data}
                open={openPolicyModal}
                nailistAvatar={nailistAvatar}
                nailistUsername={nailistUsername}
                onClose={() => setOpenPolicyModal(false)}
              />
            )}
          </div>
        </>
      )}
    </Formik>
  );
};

export default memo(UpdateUserBlock);
