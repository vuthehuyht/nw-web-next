import Chip from "@material-ui/core/Chip";
import { REPEAT_TYPE, REPEAT_TYPE_TEXT } from "@utils/constants";

const variant = {
  [REPEAT_TYPE.NEW]: "default",
  [REPEAT_TYPE.ALL]: "outlined",
  [REPEAT_TYPE.REPEATER]: "outlined",
};

const MenuTag = ({ type, className }) => (
  <Chip
    variant={variant[type]}
    size="small"
    label={REPEAT_TYPE_TEXT[type]}
    color="primary"
    className={`menu-tag-container ${className && className}`}
  />
);

export default MenuTag;
