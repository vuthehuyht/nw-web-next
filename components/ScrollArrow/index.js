import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { IconButton } from "@material-ui/core";
import smoothscroll from "smoothscroll-polyfill";

const ScrollArrow = () => {
  const [showScroll, setShowScroll] = useState(false);
  const { pathname, query } = useRouter();

  useEffect(() => {
    setShowScroll(false);
  }, [pathname, query]);

  const checkScrollTop = () => {
    if (!showScroll && window.pageYOffset > 400) {
      setShowScroll(true);
    } else if (showScroll && window.pageYOffset <= 400) {
      setShowScroll(false);
    }
  };

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    smoothscroll.polyfill();
  };

  useEffect(() => {
    if (window !== "underfind") {
      window.addEventListener("scroll", checkScrollTop);
    }
    return () => {
      window.removeEventListener("scroll", checkScrollTop);
    };
  });

  return (
    <div
      className="scrollTop"
      style={{ display: showScroll ? "flex" : "none" }}
    >
      <IconButton onClick={scrollTop}>
        <img src="/assets/images/icon-backto-top.svg" alt="to top" />
      </IconButton>
    </div>
  );
};

export default ScrollArrow;
