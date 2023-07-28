import { useState } from "react";
import { Box, Button, CircularProgress } from "@material-ui/core";
import dynamic from "next/dynamic";

const UserInformationModal = dynamic(() => import("./UserInformationModal"));

const ConfirmBooking = ({ loading }) => {
  const [openUserInformation, setOpenUserInformation] = useState(false);
  return (
    <Box className="confirm-booking-step">
      <Box className="booking-menu-container">
        {loading && (
          <Box display="flex" justifyContent="center">
            <CircularProgress size={40} />
          </Box>
        )}
      </Box>
      <Button onClick={() => setOpenUserInformation(true)}>
        User information
      </Button>
      <UserInformationModal
        open={openUserInformation}
        onClose={() => setOpenUserInformation(false)}
      />
    </Box>
  );
};

export default ConfirmBooking;
