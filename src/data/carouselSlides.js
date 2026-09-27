// Static carousel content. The source art was 12 MB of PNG; the build now
// ships WebP (see scripts/optimize-assets.mjs), so importing these eagerly
// costs roughly 400 KB in total.
import StartJourney from "../assets/StartJourney.webp";
import MyBaby from "../assets/MyBaby.webp";
import SummerLove from "../assets/SummerLove.webp";
import AngLihamNiLuna from "../assets/AngLihamNiLuna.webp";

const SLIDES = [
  {
    title: "Start Your Journey",
    description: "Create your own story and get featured on our homepage",
    author: "Chronica",
    category: "Promotion",
    image: StartJourney,
  },
  {
    title: "Featured Story",
    description: "Discover amazing stories from talented authors",
    author: "Jhae",
    category: "Fantasy | Adventure",
    image: MyBaby,
  },
  {
    title: "Latest Release",
    description: "Read the newest chapters and series",
    author: "Arvs",
    category: "Romance | Drama",
    image: SummerLove,
  },
  {
    title: "Popular Works",
    description: "Explore the most loved stories",
    author: "sekkiii",
    category: "Romance | Mystery | Slice of Life",
    image: AngLihamNiLuna,
  },
];

export default SLIDES;
