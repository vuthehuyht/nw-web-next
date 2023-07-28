import clsx from "clsx";
import { EMPTY_CONTENT } from "utils/constants";

export default function EmptyReservation({ type = "RESERVATION", className }) {
  const { title, image, content } = EMPTY_CONTENT[type];

  return (
    <div className={clsx("empty-block", { [className]: className })}>
      <span className="text">{title}</span>
      <img src={image} alt={title} className="photo" />
      <p>{content}</p>
    </div>
  );
}
