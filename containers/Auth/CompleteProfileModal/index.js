import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import _get from "lodash/get";
import _isUndefined from "lodash/isUndefined";
import dynamic from "next/dynamic";
import {
  updateInforUser,
  getUserInformation,
} from "providers/AuthProvider/actions";
import {
  getCurrentUserSuccess,
  switchProfileDialog,
} from "providers/AuthProvider/slice";
import { ERROR_MESSAGE } from "utils/errors";
import { useSpecificPageViewEvent } from "hooks";

const ProfileModal = dynamic(
  () => import("@components/Auth/CompleteProfileModal"),
  { ssr: false }
);

const CompleteProfileModal = () => {
  const dispatch = useDispatch();
  const [profileLoading, setProfileLoading] = useState(false);
  const currentUser = useSelector((state) => state.auth.currentUser);
  const profileDialogVisible = useSelector(
    (state) => state.auth.profileDialogVisible
  );
  const { trackEvent } = useSpecificPageViewEvent();

  const handleCompleteProfile = async (values, dirty) => {
    if (dirty === true) {
      setProfileLoading(true);
      try {
        const updateInfo = await updateInforUser(values);
        if (updateInfo === true) {
          const updatedUser = await getUserInformation();
          dispatch(getCurrentUserSuccess(updatedUser.user));
          dispatch(switchProfileDialog(false));
        } else {
          toast.info(ERROR_MESSAGE[_get(updateInfo, "username")]);
        }
        setProfileLoading(false);
      } catch (error) {
        toast.info(_get(error, "error.error"));
        setProfileLoading(false);
      }
    } else {
      dispatch(switchProfileDialog(false));
    }
  };

  const handleCloseCompleteProfile = (value, reason) => {
    if (reason !== "backdropClick") {
      dispatch(switchProfileDialog(value));
    }
  };

  if (profileDialogVisible) {
    return (
      <ProfileModal
        open={profileDialogVisible}
        onSubmit={handleCompleteProfile}
        onClose={handleCloseCompleteProfile}
        loading={profileLoading}
      />
    );
  }
  return null;
};

export default CompleteProfileModal;
