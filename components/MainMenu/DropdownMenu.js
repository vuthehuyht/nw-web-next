import { useState } from "react";
import _isEmpty from "lodash/isEmpty";
import PropTypes from "prop-types";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import NextLink from "next/link";

const DropdownMenu = ({ onLogout, userName, userAvatar }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const avatarSrc = _isEmpty(userAvatar)
    ? "/assets/images/default_avatar.svg"
    : userAvatar;
  const handleClick = (event, key) => {
    if (key === "logout") {
      onLogout();
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box display="flex" alignItems="center" className="user-menu">
      <Avatar alt="user-avatar" src={avatarSrc} />
      <Box
        display="flex"
        alignItems="center"
        className="box-menu"
        onClick={handleClick}
      >
        <div className="user-name">{userName}</div>
        <i className="icon-angle-down" />
      </Box>
      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        keepMounted
        getContentAnchorEl={null}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {/* <MenuItem onClick={(e) => handleClick(e, "card")}>
          クレジットカード編集
        </MenuItem> */}
        <MenuItem>
          <NextLink href="/booking-management" variant="inherit">
            あなたの予約
          </NextLink>
        </MenuItem>
        <MenuItem onClick={(e) => handleClick(e, "logout")}>
          <Typography variant="body2">ログアウト</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

DropdownMenu.propTypes = {
  userAvatar: PropTypes.string,
  userName: PropTypes.string,
  onLogout: PropTypes.func.isRequired,
};

export default DropdownMenu;
