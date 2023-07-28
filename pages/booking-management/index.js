import clsx from "clsx";
import { useRouter } from "next/router";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useSelector } from "react-redux";
import Layout from "components/Layout";
import Breadcrumbs from "@components/Breadcrumbs";
import ReservationCard from "@components/ReservationCard";
import EmptyReservation from "@components/EmptyBlock/reservation";
import { useReservation } from "hooks";

const BookingManagement = () => {
  const errorVisible = useSelector((state) => state.booking.errorVisible);

  const {
    loading,
    hasMore,
    getMoreData,
    queryPage,
    dataFuture,
    dataPassed,
    bookingIds,
    bookingEntities,
  } = useReservation();
  const { push } = useRouter();

  const breadcrumbs = [{ text: "あなたの予約" }];

  return (
    <Layout hiddenFooter>
      <div className="booking-management-layout">
        <Breadcrumbs data={breadcrumbs} />
        <div className="booking-management-heading">
          <Container>
            <h3 className="title">あなたの予約</h3>
          </Container>
        </div>
        <div className="booking-management-layout__inner reservation-wrapper">
          <Container>
            {loading && !hasMore && (
              <div className="loading-box">
                <CircularProgress color="primary" />
              </div>
            )}
            {!loading && bookingIds.length === 0 && (
              <EmptyReservation className="empty-reservation" />
            )}
            {bookingIds.length > 0 && (
              <>
                {dataFuture.length > 0 && (
                  <div className="future-reservations">
                    <h3 className="reservation-wrapper__title">今後の予約</h3>
                    <div className="reservation-wrapper__inner">
                      {dataFuture.map((bookingId) => {
                        const bookingEntity = bookingEntities[bookingId] || {};
                        return (
                          <ReservationCard
                            key={bookingEntity.objectId}
                            data={bookingEntity}
                            isFuture
                            onClick={() =>
                              push(
                                `booking-management/${bookingEntity.objectId}`
                              )
                            }
                            isPaymentError={bookingEntity.isPaymentError}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}
                {dataPassed.length > 0 && (
                  <div className="passed-reservations">
                    <h3 className="reservation-wrapper__title">過去の予約</h3>
                    <div className="reservation-wrapper__inner">
                      {dataPassed.map((bookingId) => {
                        const bookingEntity = bookingEntities[bookingId] || {};
                        return (
                          <ReservationCard
                            key={bookingEntity.objectId}
                            data={bookingEntity}
                            isFuture={false}
                            onClick={() =>
                              push(
                                `booking-management/${bookingEntity.objectId}`
                              )
                            }
                          />
                        );
                      })}
                    </div>
                  </div>
                )}
                {loading && hasMore && queryPage > 1 && (
                  <div className="loading-box">
                    <CircularProgress color="primary" />
                  </div>
                )}
                <div
                  className={clsx("action-reservations", {
                    "has-error": errorVisible,
                  })}
                >
                  <Button
                    className="btn-load-more"
                    variant="outlined"
                    color="primary"
                    endIcon={<i className="icon-angle-right" />}
                    onClick={getMoreData}
                    disabled={loading || !hasMore}
                  >
                    もっと見る
                  </Button>
                </div>
              </>
            )}
          </Container>
        </div>
      </div>
    </Layout>
  );
};

BookingManagement.auth = {
  private: true,
};

export default BookingManagement;
