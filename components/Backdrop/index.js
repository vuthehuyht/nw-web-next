import { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { Backdrop as MUIBackdrop, CircularProgress } from "@material-ui/core";
import { switchBackdropVisible } from "@providers/GeneralProvider/slice";

const Backdrop = () => {
  const { pathname, query } = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(switchBackdropVisible(false));
  }, [pathname, query, dispatch]);

  const backdropVisible = useSelector((state) => state.general.backdropVisible);

  // Increase number to show above the modal
  return (
    <MUIBackdrop style={{ zIndex: 1500 }} open={backdropVisible}>
      <CircularProgress color="secondary" />
    </MUIBackdrop>
  );
};

export default Backdrop;
