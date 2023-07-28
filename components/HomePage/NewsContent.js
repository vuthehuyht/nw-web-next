import { Container } from "@material-ui/core";
import Carousel from "react-multi-carousel";
import NewsCard from "@components/NewsCard";
import mock from "./mockNews.json";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 6,
    paritialVisibilityGutter: 0,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 3,
    paritialVisibilityGutter: 0,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 2,
    paritialVisibilityGutter: 0,
  },
};

export default function NewsContent() {
  return (
    <Container className="news-section">
      <Carousel ssr itemClass="news-item" responsive={responsive}>
        {mock.map((item) => (
          <NewsCard data={item} key={item.objectId} />
        ))}
      </Carousel>
    </Container>
  );
}
