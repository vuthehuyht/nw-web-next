export function getBackground(background) {
  if (background == null) {
    return undefined;
  }

  const { backgroundColor } = background;
  const { backgroundType } = backgroundColor;

  if (backgroundType && backgroundType === "color") {
    return { backgroundColor: backgroundColor.rgba };
  }

  if (backgroundType && backgroundType === "linear") {
    return { backgroundImage: backgroundColor.linear };
  }
  return undefined;
}
