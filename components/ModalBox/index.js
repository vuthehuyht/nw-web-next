import PropTypes from "prop-types";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Container from "@material-ui/core/Container";

function ModalBox(props) {
  const { className, closeIcon, children, trigger, title, changeStatus, open } =
    props;
  // const [openModal, setOpenModal] = useState(false);

  const handleOpen = () => {
    // setOpenModal(true);
    if (changeStatus) {
      changeStatus(true);
    }
  };

  const handleClose = () => {
    // setOpenModal(false);
    if (changeStatus) {
      changeStatus(false);
    }
  };

  return (
    <div className={`modal-box ${className || ""}`}>
      <Button variant="outlined" color="primary" onClick={handleOpen}>
        {trigger || "Open modal"}
      </Button>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        className={`modal ${className || ""}`}
      >
        <div className="modal-header">
          <h3>{title}</h3>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
            className="btn-close"
          >
            {closeIcon}
          </IconButton>
        </div>
        <div className="modal-inner">
          <Container className="container" maxWidth="md">
            {children}
          </Container>
        </div>
      </Dialog>
    </div>
  );
}

ModalBox.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  closeIcon: PropTypes.oneOfType([PropTypes.node, PropTypes.object]),
  children: PropTypes.any,
  open: PropTypes.bool,
  trigger: PropTypes.node,
  changeStatus: PropTypes.func,
};

export default ModalBox;
