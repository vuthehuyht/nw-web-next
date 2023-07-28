import { forwardRef } from "react";
import Typography from "@material-ui/core/Typography";
import { NO_OFF } from "utils/constants";
import BookingMenuItem from "components/Booking/BookingMenus/BookingMenuItem";

const BookingMenuList = forwardRef(
  (
    {
      menus = [],
      title,
      onSelectedMenu,
      selectedMenus = [],
      relatedId,
      activeNormalMenu,
      showImage = true,
    },
    ref
  ) => {
    const recommendMenu = selectedMenus.find((menu) => menu.recommend);

    return (
      <div className="booking-menu-list">
        <Typography variant="body2" className="booking-menu-title">
          {title}
        </Typography>
        {menus.map((menu) => (
          <BookingMenuItem
            showImage={showImage}
            showDetail={menu.objectId !== NO_OFF.objectId}
            key={menu.objectId}
            menu={menu}
            onSelectedMenu={onSelectedMenu}
            relatedId={relatedId}
            ref={
              recommendMenu && menu.objectId === recommendMenu.menuId
                ? ref
                : null
            }
            checked={
              !!selectedMenus.find(
                (item) =>
                  item.menuId === menu.objectId ||
                  (activeNormalMenu === item.menuId &&
                    item.optionId === menu.objectId)
              )
            }
          />
        ))}
      </div>
    );
  }
);

export default BookingMenuList;
