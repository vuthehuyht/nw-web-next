import PropTypes from "prop-types";
import IconButton from "@material-ui/core/IconButton";
import { useRouter } from "next/router";
import Helper from "@utils/helper";

const AppBar = ({ className, title, userData, handleBack, nameIconTitle }) => {
  const { push, back } = useRouter();
  const handleGoBack = () => {
    if (typeof handleBack === "string") {
      if (Helper.canGoBack()) {
        back();
      } else {
        push(handleBack);
      }
    }
  };
  return (
    <div className={`header-app-bar ${className || ""}`}>
      <div className="control-btn">
        <IconButton
          className="back-btn"
          onClick={handleGoBack}
          aria-label="back"
          scroll
        >
          <i className="icon-angle-left" />
        </IconButton>
        {userData && (
          <div className="user-area" onClick={handleGoBack}>
            <img src={userData.avatar} alt={userData.username} />
          </div>
        )}
      </div>
      <div className="heading">
        {nameIconTitle && <i className={nameIconTitle} />}
        <h3 className="title">{title}</h3>
      </div>
    </div>
  );
};

AppBar.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  nameIconTitle: PropTypes.string,
  handleBack: PropTypes.string,
  userData: PropTypes.object,
};

export default AppBar;
