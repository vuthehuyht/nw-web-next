import PropTypes from "prop-types";
import MenuItem from "./MenuItem";

const MenuPage = ({ className }) => {
  const dataMenu = null;

  return (
    <div className={`menu-list-wrapper ${className || ""}`}>
      {dataMenu &&
        dataMenu.map((menuParent) => (
          <div key={menuParent.objectId} className="menu-wrapper">
            <h3>{menuParent.title}</h3>
            <div className="details-menu">
              {menuParent.menus.map((item) => (
                <MenuItem key={item.objectId} data={item} />
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};

MenuPage.propTypes = {
  className: PropTypes.string,
  id: PropTypes.any,
};

export default MenuPage;
