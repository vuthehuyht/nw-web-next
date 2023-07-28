import { useEffect } from "react";
import _get from "lodash/get";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  getCurrentUserSuccess,
  setLoadingUser,
} from "providers/AuthProvider/slice";
import { getUserInformation } from "providers/AuthProvider/actions";
import useWebCookie from "./useWebCookie";

const useFetchUser = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.auth.isLoading);
  const currentUser = useSelector((state) => state.auth.currentUser);
  const { objectId: currentUserId } = currentUser;
  const { webCookie } = useWebCookie();
  const objectId = _get(webCookie, "objectId");

  useEffect(() => {
    if (objectId) {
      try {
        setLoadingUser(true);
        getUserInformation({ userId: objectId }).then((result) => {
          dispatch(getCurrentUserSuccess(result.user));
        });
      } catch (error) {
        toast.info(_get(error, "error.error"));
      } finally {
        setLoadingUser(false);
      }
    }
  }, [objectId, dispatch]);
  return { isLoading, currentUserId };
};

export default useFetchUser;
