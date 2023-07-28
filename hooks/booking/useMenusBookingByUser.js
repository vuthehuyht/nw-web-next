import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMenusBookingByUser } from "providers/BookingProvider/actions";
import { setMenus } from "providers/BookingProvider/slice";

const useMenusBookingByUser = ({ userId }) => {
  const dispatch = useDispatch();
  const menus = useSelector((state) => state.booking.menus[userId]) || [];
  const [loading, setLoading] = useState(false);

  const handleGetMenusBookingByUser = async () => {
    try {
      setLoading(true);
      const result = await getMenusBookingByUser({ userId });
      dispatch(setMenus({ userId, menus: result }));
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (userId) {
      handleGetMenusBookingByUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, userId]);

  return { menus, loading, handleGetMenusBookingByUser };
};

export default useMenusBookingByUser;
