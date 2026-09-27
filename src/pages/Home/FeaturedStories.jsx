import { StoryCatalogue } from "../../components/StoryCatalogue";
import { featuredSelect } from "../../lib/selectors";
import { byNumberDesc } from "../../lib/format";

export default function FeaturedStories() {
  return (
    <StoryCatalogue
      title="FEATURED STORIES"
      subtitle="Hand-picked by the Chronica team"
      emptyTitle="No featured stories yet"
      emptyMessage="Check back soon for staff picks."
      icon="fa-solid fa-star"
      select={featuredSelect}
      sort={byNumberDesc}
    />
  );
}
