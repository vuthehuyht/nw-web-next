import CustomLink from "./custom-link";
import Image from "./image";

const StepElement = ({ className, title, description, step, imageLinks }) => (
  <div className={className}>
    <div className="step-heading">
      <div className="step-heading-inner">Step{step}</div>
    </div>
    <div className="step-inner">
      {title && <div>{title}</div>}
      <div
        className="step-content"
        dangerouslySetInnerHTML={{ __html: description }}
      />
      {imageLinks && imageLinks.length > 0 && (
        <div className="image-links">
          {imageLinks.map((item) => (
            <CustomLink key={item.link} link={{ url: item.link }}>
              <Image media={item.image} />
            </CustomLink>
          ))}
        </div>
      )}
    </div>
  </div>
);

export default StepElement;
