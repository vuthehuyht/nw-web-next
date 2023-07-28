import { useState } from "react";
import PropTypes from "prop-types";
import { useField } from "formik";
import dynamic from "next/dynamic";
import CircularProgress from "@material-ui/core/CircularProgress";
import Badge from "@material-ui/core/Badge";
import Avatar from "@material-ui/core/Avatar";
import { uploadImage } from "providers/ResourceProvider/actions";
import { IMAGE_TYPE } from "utils/constants";

const ImageCrop = dynamic(() => import("./ImageCrop"));

const readFile = (file) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result), false);
    reader.readAsDataURL(file);
  });

const UploadAvatar = ({
  className = "",
  name,
  userId,
  uploadType = IMAGE_TYPE.AVATAR,
}) => {
  const [field, , helper] = useField(name);
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(false);
  const value = field.value || {};

  const onFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageDataUrl = await readFile(file);
      setImageSrc(imageDataUrl);
    }
    e.target.value = null;
  };

  const handleClose = () => {
    setImageSrc(null);
  };

  const handleSave = async ({ file }) => {
    try {
      setImageSrc(null);
      setLoading(true);
      const result = await uploadImage({ file, uploadType, userId });
      helper.setValue(result);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div className={`upload-avatar-container ${className}`}>
      <label htmlFor="avatar">
        <Badge
          overlap="circular"
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          badgeContent={<i className="icon-plus" />}
        >
          <Avatar alt="avatar" src={loading ? null : value.url}>
            {loading ? (
              <CircularProgress color="secondary" size={24} />
            ) : (
              <i className="icon-default-user" />
            )}
          </Avatar>
        </Badge>
      </label>
      <input
        type="file"
        id="avatar"
        name="avatar"
        disabled={loading}
        onChange={onFileChange}
        accept="image/png, image/jpeg"
      />
      {!!imageSrc && (
        <ImageCrop
          image={imageSrc}
          handleClose={handleClose}
          width={320}
          height={320}
          borderRadius={320}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

UploadAvatar.displayName = "UploadAvatar";

UploadAvatar.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  uploadType: PropTypes.string,
  userId: PropTypes.string,
};

export default UploadAvatar;
