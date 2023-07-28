import { useState, useEffect, useRef } from "react";
import AvatarEditor from "react-avatar-editor";
import Slider from "@material-ui/core/Slider";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Modal from "@components/Modal";

const ImageCrop = ({
  image,
  width,
  height,
  onSave,
  borderRadius,
  handleClose,
}) => {
  const [imageDimentions, setImageDimentions] = useState({});
  const [scale, setScale] = useState(1);
  const editor = useRef(null);

  // used to generate original image dimentions for being able
  // to convert the percentage crop into correct x1, y1 and x2, y2 coords
  useEffect(() => {
    const img = new Image();
    // eslint-disable-next-line func-names
    img.onload = function () {
      setImageDimentions({ h: img.naturalWidth, w: img.naturalWidth });
    };
    img.src = image;
  }, [image]);

  const handleSave = async () => {
    const coords = {};
    if (editor.current) {
      const { h, w } = imageDimentions;
      const {
        x: Cx,
        y: Cy,
        height: Ch,
        width: Cw,
      } = editor.current.getCroppingRect();

      coords.x1 = w * Cx;
      coords.y1 = h * Cy;
      coords.x2 = coords.x1 + w * Cw;
      coords.y2 = coords.y1 + h * Ch;
    }

    const img = editor.current.getImageScaledToCanvas().toDataURL();
    const responseBase64 = await fetch(img);
    const file = await responseBase64.blob();
    const url = window.URL.createObjectURL(file);
    onSave({ coords, file, url, base64: img });
  };

  return (
    <Modal
      className="crop-image-modal"
      title="写真をアップ"
      maxWidth="md"
      open={!!image}
      handleClose={handleClose}
    >
      <Box display="flex" justifyContent="center">
        <AvatarEditor
          ref={editor}
          image={image}
          border={0}
          width={width}
          height={height}
          scale={scale}
          borderRadius={borderRadius}
          crossOrigin="anonymous"
        />
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        marginTop="28px"
        className="zoom-container"
      >
        <Typography variant="subtitle2">ズーム</Typography>
        <Slider
          color="secondary"
          name="scale"
          type="range"
          onChange={(e, value) => setScale(value)}
          min={1}
          max={2}
          step={0.01}
          defaultValue={1}
        />
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        marginTop="32px"
        className="btn-container"
      >
        <Box display="flex" maxWidth="360px" width="100%">
          <Button
            variant="outlined"
            className="cancel-btn"
            onClick={handleClose}
          >
            キャンセル
          </Button>
          <Button
            variant="contained"
            color="secondary"
            className="confirm-btn"
            onClick={handleSave}
          >
            保存
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ImageCrop;
