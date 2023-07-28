import Skeleton from "@material-ui/lab/Skeleton";
import { isMobile } from "react-device-detect";

export default function BannerSkeleton() {
  return <Skeleton animation="wave" height={isMobile ? 269 : 480} />;
}
