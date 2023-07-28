import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import Container from "@material-ui/core/Container";
import _isEmpty from "lodash/isEmpty";
import CircularProgress from "@material-ui/core/CircularProgress";
import Layout from "components/Layout";
import Breadcrumbs from "@components/Breadcrumbs";
import { errorBookingSelector } from "providers/BookingProvider/slice";
import ReservationCard from "@components/ReservationCard";
import useFetchErrorBookings from "hooks/booking-management/useFetchErrorBookings";

const ErrorPaymentBooking = () => {
  const errorBookingIds = useSelector(errorBookingSelector.selectIds) || [];
  const errorBookingEntities = useSelector(errorBookingSelector.selectEntities);

  const { push } = useRouter();
  const { loading } = useFetchErrorBookings();

  const breadcrumbs = [{ text: "あなたの予約" }];

  return (
    <Layout hiddenFooter>
      <div className="booking-management-layout">
        <Breadcrumbs data={breadcrumbs} />
        <div className="booking-management-heading">
          <Container>
            <h3 className="title">お支払いエラー</h3>
          </Container>
        </div>
        <div className="booking-management-layout__inner reservation-wrapper">
          <Container>
            {loading && _isEmpty(errorBookingIds) && (
              <div className="loading-box">
                <CircularProgress color="primary" />
              </div>
            )}
            {errorBookingIds.length > 0 &&
              errorBookingIds.map((bookingId) => (
                <ReservationCard
                  key={errorBookingEntities[bookingId].objectId}
                  data={errorBookingEntities[bookingId]}
                  isFuture
                  onClick={() =>
                    push(
                      `booking-management/${errorBookingEntities[bookingId].objectId}`
                    )
                  }
                  isPaymentError
                />
              ))}
          </Container>
        </div>
      </div>
    </Layout>
  );
};

ErrorPaymentBooking.auth = {
  private: true,
};

export default ErrorPaymentBooking;
