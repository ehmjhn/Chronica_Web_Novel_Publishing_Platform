import { StoryCatalogue } from "../../components/StoryCatalogue";
import { latestSelect } from "../../lib/selectors";
import { byIdDesc } from "../../lib/format";

export default function LatestRelease() {
  return (
    <StoryCatalogue
      title="LATEST RELEASES"
      subtitle="Freshly published series"
      emptyTitle="No recent releases"
      emptyMessage="Nothing new in the last few weeks."
      icon="fa-solid fa-clock"
      select={latestSelect}
      sort={byIdDesc}
    />
  );
}
