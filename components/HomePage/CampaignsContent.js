import { Grid } from "@material-ui/core";
import CampaignCard from "@components/CampaignCard";

const CampaignsContent = ({ data }) => (
  <Grid container spacing={4}>
    {data &&
      data.length > 0 &&
      data.map((post) => (
        <Grid item key={post.objectId} xs={12} md={6}>
          <CampaignCard data={post} />
        </Grid>
      ))}
  </Grid>
);

export default CampaignsContent;
