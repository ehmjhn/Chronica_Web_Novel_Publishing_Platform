import { StoryCatalogue } from "../../components/StoryCatalogue";
import { popularSelect } from "../../lib/selectors";
import { byNumberDesc } from "../../lib/format";

export default function PopularWorks() {
  return (
    <StoryCatalogue
      title="POPULAR WORKS"
      subtitle="What readers are loving"
      emptyTitle="Nothing here yet"
      emptyMessage="Publish a series to see it here."
      icon="fa-solid fa-fire"
      select={popularSelect}
      sort={byNumberDesc}
    />
  );
}
