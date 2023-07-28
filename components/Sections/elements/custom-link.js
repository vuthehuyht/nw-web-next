import Link from "next/link";

const CustomLink = ({ link, children, className }) => {
  if (!link) {
    return <div>{children}</div>;
  }

  const isInternalLink = link.url.startsWith("/");

  // For internal links, use the Next.js Link component
  if (isInternalLink) {
    return (
      <Link href="/[[...slug]]" as={link.url} className={className}>
        <a>{children}</a>
      </Link>
    );
  }

  // Plain <a> tags for external links
  return link.newTab ? (
    // Change target and rel attributes is newTab is turned on
    <a
      href={link.url}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ) : (
    <a href={link.url} className={className} target="_self" rel="">
      {children}
    </a>
  );
};

export default CustomLink;
