import { useState, cloneElement } from "react";
import dynamic from "next/dynamic";

const InstallationPopup = dynamic(() => import("./InstallationPopup"));

const InstallationPopupWrapper = ({ children, title, footer, ...props }) => {
  const [openInstallPopup, setOpenInstallPopup] = useState(false);
  return (
    <>
      {cloneElement(children, {
        ...props,
        onClick: (e) => {
          e.preventDefault();
          setOpenInstallPopup(true);
        },
      })}
      {openInstallPopup && (
        <InstallationPopup
          title={title}
          footer={footer}
          open={openInstallPopup}
          onClose={() => {
            setOpenInstallPopup(false);
          }}
        />
      )}
    </>
  );
};

export default InstallationPopupWrapper;
