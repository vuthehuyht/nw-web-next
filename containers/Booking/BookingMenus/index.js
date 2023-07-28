import { useState, useEffect, useCallback } from "react";
import _isEmpty from "lodash/isEmpty";
import _isEqual from "lodash/isEqual";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import { CircularProgress } from "@material-ui/core";
import { usePrevious } from "hooks";
import BookingMenuList from "./BookingMenuList";
import OptionalMenuModal from "./OptionalMenusModal";

const BookingMenu = ({
  bookingMenus = [],
  onSubmit,
  defaultValue = [],
  loading,
}) => {
  const [mounted, setMounted] = useState(false);
  const [selectedMenus, setSelectedMenus] = useState(defaultValue);
  const [optionalMenu, setOptionalMenu] = useState({});
  const [relatedId, setRelatedId] = useState();
  const [activeNormalMenu, setActiveNormalMenu] = useState();
  const [open, setOpen] = useState(false);
  const prevBookingMenus = usePrevious(bookingMenus);

  const normalMenus = bookingMenus.filter((menu) => menu.type === "NORMAL");

  const recommendRef = useCallback((node) => {
    if (node !== null) {
      node.scrollIntoView({
        block: "center",
      });
    }
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // This hook for default recommended menu from nailist screen
    if (defaultValue && !_isEqual(prevBookingMenus, bookingMenus)) {
      // Check if there is recommended menu in default value
      const recommendMenu = defaultValue.find((menu) => menu.recommend);
      if (recommendMenu) {
        // If there is recommended menu, we must get full detail of recommended menu
        const activeMenu = bookingMenus.find(
          (menu) =>
            menu.type === "NORMAL" &&
            menu.menus.map((m) => m.objectId).includes(recommendMenu.menuId)
        );
        // Set need state as when we click on the menu
        if (activeMenu) {
          setRelatedId(recommendMenu.menuId);
          // FInd the optional menu of recommended menu
          const foundOptionalMenu = bookingMenus.find(
            (menu) => menu.objectId === activeMenu.optionalId
          );
          if (foundOptionalMenu) {
            // Set needed state to open the optional menu
            setActiveNormalMenu(recommendMenu.menuId);
            setOptionalMenu(foundOptionalMenu);
            setOpen(true);
          }
        }
      }
    }
  }, [defaultValue, bookingMenus, prevBookingMenus]);

  const onSelectedMenu = (menuData) => {
    const menuId = menuData.objectId;
    const optionId = menuData.relatedId;

    // Filtered selected menus
    const filteredMenus = selectedMenus.filter(
      (menu) => menu.menuId !== menuId
    );
    if (filteredMenus.length === selectedMenus.length) {
      setActiveNormalMenu(menuId);
      setSelectedMenus((menus) => menus.concat({ menuId }));
      if (optionId) {
        setRelatedId(menuId);
        const foundOptionalMenu = bookingMenus.find(
          (menu) => menu.objectId === optionId
        );
        if (foundOptionalMenu) {
          setOptionalMenu(foundOptionalMenu);
          setOpen(true);
        }
      }
    } else setSelectedMenus(filteredMenus);
  };

  const handleCloseOptionalMenus = (e, reason) => {
    if (reason !== "backdropClick") {
      setRelatedId();
      const filteredMenus = selectedMenus.filter(
        (menu) => menu.menuId !== relatedId
      );
      setOpen(false);
      setActiveNormalMenu();
      setSelectedMenus(filteredMenus);
    }
  };

  const handleSelectOptionalMenu = (menuData) => {
    const optionId = menuData.objectId;
    const menuId = menuData.relatedId;
    const selectedMenu = selectedMenus.map((menu) =>
      menu.menuId === menuId ? { ...menu, optionId } : menu
    );
    setSelectedMenus(selectedMenu);
    setRelatedId();
    setOpen(false);
  };

  return (
    <Box className="booking-menu-selection-step">
      <Box className="booking-menu-container">
        {_isEmpty(normalMenus) && loading && (
          <Box display="flex" justifyContent="center">
            <CircularProgress size={40} />
          </Box>
        )}
        {normalMenus.map((normalMenu) => (
          <BookingMenuList
            relatedId={normalMenu.optionalId}
            selectedMenus={selectedMenus}
            menus={normalMenu.menus}
            title={normalMenu.title}
            key={normalMenu.objectId}
            onSelectedMenu={onSelectedMenu}
            loading={loading}
            ref={recommendRef}
          />
        ))}
        <OptionalMenuModal
          open={open}
          menu={optionalMenu || {}}
          onSelectedMenu={handleSelectOptionalMenu}
          onClose={handleCloseOptionalMenus}
          relatedId={relatedId}
          selectedMenus={selectedMenus}
          onExited={() => setOptionalMenu([])}
          activeNormalMenu={activeNormalMenu}
        />
      </Box>
      <Box className="submit-btn-container">
        <Button
          className="submit-btn"
          variant="contained"
          color="secondary"
          type="submit"
          disabled={mounted && _isEmpty(selectedMenus)}
          onClick={() => onSubmit(selectedMenus)}
        >
          日時選択へ
        </Button>
      </Box>
    </Box>
  );
};

export default BookingMenu;
