import _get from "lodash/get";
import NumberFormat from "react-number-format";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Link from "next/link";
import Button from "@material-ui/core/Button";

const ContentPostThumbnail = ({ data }) => (
  <>
    <div className="post-thumbnail__img">
      <LazyLoadImage
        alt={_get(data, "objectId")}
        className="gallery-img"
        height="100%"
        placeholderSrc={_get(data, "thumbnail")}
        src={_get(data, "thumbnail")}
        wrapperClassName="gallery-img-wrapper"
        effect="blur"
      />
    </div>
    <div className="post-thumbnail__details">
      {_get(data, "taggedMenuPrice") > 0 && (
        <div className="post-thumbnail__tag type-price">
          <NumberFormat
            value={_get(data, "taggedMenuPrice")}
            displayType={"text"}
            prefix={"¥"}
            thousandSeparator
            renderText={(value) => <span>{value}</span>}
          />
        </div>
      )}
    </div>
    {_get(data, "nailImages")?.length > 1 && (
      <img src="/assets/images/multi.png" className="type-multi-icon" />
    )}
  </>
);
const PostThumbnail = ({ className, data, last = false, userId }) => {
  if (last) {
    return (
      <Link
        passHref
        href="/nailist/[nailieId]/posts"
        as={`/nailist/${userId}/posts`}
      >
        <Button
          type="button"
          className={`post-thumbnail last-item ${className || ""}`}
        >
          <ContentPostThumbnail data={data} />
          <div className="post-more-btn">
            <div className="inner-post-more-btn">
              <span>もっと見る</span>
              <i className="icon-angle-right" />
            </div>
          </div>
        </Button>
      </Link>
    );
  }
  return (
    <Link
      passHref
      href="/nailist/[nailieId]/posts/[postId]"
      as={`/nailist/${userId}/posts/${_get(data, "objectId")}`}
    >
      <Button type="button" className={`post-thumbnail ${className || ""}`}>
        <ContentPostThumbnail data={data} />
      </Button>
    </Link>
  );
};

export default PostThumbnail;
