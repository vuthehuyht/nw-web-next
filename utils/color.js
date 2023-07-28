export function getTextColor(textColorObj) {
  if (textColorObj == null) {
    return { color: "rgb(50, 68, 82)" };
  }

  const { textColor } = textColorObj;
  return { color: `${textColor.hex}` };
}
