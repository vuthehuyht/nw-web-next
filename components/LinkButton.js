import PropTypes from "prop-types";
import { forwardRef } from "react";
import NextLink from "next/link";
import { Button as MuiButton } from "@material-ui/core";

const LinkButton = forwardRef(
  (
    {
      href,
      as,
      prefetch,
      locale,
      scroll = true,
      shallow = false,
      replace = false,
      ...props
    },
    ref
  ) => (
    <NextLink
      href={href}
      as={as}
      prefetch={prefetch}
      locale={locale}
      passHref
      scroll={scroll}
      shallow={shallow}
      replace={replace}
    >
      <MuiButton ref={ref} {...props} />
    </NextLink>
  )
);

LinkButton.defaultProps = {
  href: "#",
};

LinkButton.propTypes = {
  href: PropTypes.string,
  locale: PropTypes.string,
  as: PropTypes.string,
  prefetch: PropTypes.bool,
  scroll: PropTypes.bool,
  shallow: PropTypes.bool,
  replace: PropTypes.bool,
};

export default LinkButton;
