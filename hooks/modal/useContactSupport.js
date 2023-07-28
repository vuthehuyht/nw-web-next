import { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import _get from "lodash/get";

import { saveQuestionSupportTicketForApp } from "providers/AuthProvider/actions";
import { switchConfirmModal } from "@providers/GeneralProvider/slice";

const useContactSupport = (types) => {
  const dispatch = useDispatch();
  const [openContact, setOpenContact] = useState(false);
  const [loadingContact, setLoadingContact] = useState(false);

  const handleContact = async (values) => {
    setLoadingContact(true);
    try {
      await saveQuestionSupportTicketForApp({ ...values, types });
      setLoadingContact(false);
      setOpenContact(false);
      dispatch(
        switchConfirmModal({
          visible: true,
          data: {
            title: "お問い合わせありがとうございます",
            message:
              "事務局にて確認し、ご登録のメールアドレスへお返事させていただきます。お問い合わせ内容によっては返事まで数日かかる場合もございます。ご了承ください。",
            hideCancelBtn: true,
          },
        })
      );
    } catch (error) {
      toast.info(_get(error, "error.error"));
      setLoadingContact(false);
    }
  };

  const handleCloseContact = (_, reason) => {
    if (reason !== "backdropClick") {
      setOpenContact(false);
    }
  };

  return {
    openContact,
    loadingContact,
    handleContact,
    handleCloseContact,
    setOpenContact,
  };
};

export default useContactSupport;
