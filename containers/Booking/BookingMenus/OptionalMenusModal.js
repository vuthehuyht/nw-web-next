import PropTypes from "prop-types";
import Modal from "@components/Modal";
import { NO_OFF } from "@utils/constants";
import BookingMenuList from "./BookingMenuList";

const OptionalMenuModal = ({
  open,
  onClose,
  menu,
  onSelectedMenu,
  relatedId,
  selectedMenus,
  onExited,
  activeNormalMenu,
}) => (
  <Modal
    className="optional-menu-modal"
    title="オフを選択してください"
    open={open}
    handleClose={onClose}
    TransitionProps={onExited}
    maxWidth="md"
  >
    <BookingMenuList
      selectedMenus={selectedMenus}
      menus={[NO_OFF].concat(menu.menus)}
      title={menu.title}
      onSelectedMenu={onSelectedMenu}
      relatedId={relatedId}
      sub
      showImage={false}
      activeNormalMenu={activeNormalMenu}
    />
  </Modal>
);

OptionalMenuModal.propTypes = {
  menu: PropTypes.object.isRequired,
  onSelectedMenu: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  relatedId: PropTypes.string,
  selectedMenus: PropTypes.array.isRequired,
  onExited: PropTypes.func.isRequired,
  activeNormalMenu: PropTypes.string,
};

export default OptionalMenuModal;
