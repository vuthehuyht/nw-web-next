import { Container } from "@material-ui/core";
import Reservation from "./Reservation";
import Request from "./Request";

const ConfirmComplete = ({ type, nailistAvatar, bookingSlot, bookingDate }) => (
  <div className="confirm-complete">
    <Container maxWidth="md">
      {type === "CONFIRMED" ? (
        <Reservation
          nailistAvatar={nailistAvatar}
          bookingSlot={bookingSlot}
          bookingDate={bookingDate}
        />
      ) : (
        <Request nailistAvatar={nailistAvatar} />
      )}
    </Container>
  </div>
);

export default ConfirmComplete;
