/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
import { SOCIAL_MEDIA } from "@utils/constants";

export default function SocialMedia() {
  return (
    <div className="social-media-wrapper">
      {SOCIAL_MEDIA.map((item) => {
        if (item.link) {
          return (
            <a
              key={item.type}
              href={item.link}
              target="_blank"
              rel="noreferrer noopener"
            >
              <span className={item.icon}></span>
            </a>
          );
        }
      })}
    </div>
  );
}
