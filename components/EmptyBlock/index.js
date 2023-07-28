import clsx from "clsx";
import { EMPTY_CONTENT } from "utils/constants";

export default function EmptyBlock({ type = "TOPMENU", className }) {
  const { title, image } = EMPTY_CONTENT[type];

  return (
    <div className={clsx("empty-block", { [className]: className })}>
      <img src={image} alt={title} className="photo" />
      <span className="text">{title}</span>
    </div>
  );
}
