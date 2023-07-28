import { forwardRef } from "react";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Image from "next/image";
import Checkbox from "@material-ui/core/Checkbox";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import helper from "@utils/helper";
import MenuTag from "./MenuTag";

const BookingMenuItem = forwardRef(
  (
    {
      menu = {},
      onSelectedMenu,
      checked,
      relatedId,
      showImage = true,
      showDetail = true,
    },
    ref
  ) => {
    const { objectId, repeatType, image, price, time, title, detail } = menu;
    return (
      <div className="booking-menu-item" ref={ref}>
        <FormControlLabel
          className={`${showImage ? "image-label" : ""}`}
          value={relatedId ? `${objectId}-${relatedId}` : objectId}
          control={
            <Checkbox
              checked={checked}
              onChange={() => onSelectedMenu({ ...menu, relatedId })}
              color="primary"
              icon={<i className="icon-uncheck" />}
              checkedIcon={<i className="icon-round-checked" />}
            />
          }
          label={
            <div className="menu-item-label-container">
              {showImage && (
                <Box className="item-image-container">
                  <Image
                    width="80px"
                    height="80px"
                    src={image || "/assets/images/default-img.svg"}
                    alt=""
                  />
                </Box>
              )}
              <div className="menu-item-info">
                {repeatType && <MenuTag type={repeatType} />}
                <Typography
                  className="menu-item-title"
                  variant="body2"
                  component="span"
                >
                  {title}
                </Typography>

                {showDetail && (
                  <>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography className="menu-item-time" variant="caption">
                        所要時間{time}分
                      </Typography>
                      <Typography className="menu-item-price" variant="body1">
                        ¥{helper.addCommaToString(price)}
                      </Typography>
                    </Box>
                    <Typography
                      className="menu-item-detail"
                      variant="caption"
                      display="block"
                    >
                      {detail}
                    </Typography>
                  </>
                )}
              </div>
            </div>
          }
        />
      </div>
    );
  }
);

export default BookingMenuItem;
