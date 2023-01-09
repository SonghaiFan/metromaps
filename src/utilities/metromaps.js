// @satyaborg TODO: read data instead of importing
import noFilterView1 from "../data/05_04_2022/metromap_no_filter_n_neighbour_10_min_cluster_10.json";
import noFilterView2 from "../data/04_05_2022/20220503_no_filter_no_chunk_minlm.json";
import ukrRus from "../data/05_04_2022/ukr_rus_war.json";
import electionView from "../data/04_05_2022/election2.json";
import domesticViolence from "../data/01_07_2022/01_07_2022_1656654308.json";
import domesticViolencePre2014 from "../data/01_07_2022/01_07_2022_1656653072.json";
import domesticViolencePost2014 from "../data/01_07_2022/01_07_2022_1656653417.json";
import ying12 from "../data/1x2-14_29.json";
import ying13 from "../data/1x3-0.json";
import ying22v1 from "../data/2x2.json";
import ying22v2 from "../data/2x2-23_42.json";
import ying23v1 from "../data/2x3-1_8.json";
import ying23v2 from "../data/2x3-5_20.json";
import ying33 from "../data/3x3.json";
import introPage from "../data/intro_page.json";
import allView from "../data/31_08_2022_1661913079_all_REDUCED.json";
import govView from "../data/21_09_2022_1663741409_gov.json";
import voiceView from "../data/21_09_2022_1663742238_voice.json";

// Give name, title, (description?) here after importing
const METROMAPS = [
  {
    url: "1x2-14_29",
    title: "1x2-14_29",
    data: ying12,
    description: "",
    subtitle: "’",
    hint: "",
    time: 30,
  },
  // {
  //   url: "1x3",
  //   title: "1x3",
  //   data: ying13,
  //   description: "",
  //   subtitle: "",
  //   hint: "",
  //   time: 60,
  // },
  {
    url: "2x2",
    title: "2x2",
    data: ying22v1,
    description: "",
    subtitle: "",
    hint: "",
    time: 60,
  },
  {
    url: "2x2-23_42",
    title: "2x2-23_42",
    data: ying22v2,
    description: " ",
    subtitle: "",
    hint: "",
    time: 60,
  },
  {
    url: "2x3-1_8",
    title: "2x3-1_8",
    data: ying23v1,
    description: "",
    time: 60,
  },
  {
    url: "2x3-5_20",
    title: "2x3-5_20",
    data: ying23v2,
    description: "",
    time: 60,
  },
  {
    url: "3x3",
    title: "3x3",
    data: ying33,
    description: "",
    time: 60,
  },
  {
    url: "election",
    title: "Election",
    data: electionView,
    description: "",
    time: 60,
  },
  {
    url: "ukr-rus-war",
    title: "Ukraine-Russia War",
    data: ukrRus,
    description: "",
    time: 60,
  },
  {
    url: "domestic-violence",
    title: "Domestic Violence (all)",
    data: domesticViolence,
    description: "",
    time: 60,
  },
  {
    url: "domestic-violence-pre-2014",
    title: "Domestic Violence (pre-2014)",
    data: domesticViolencePre2014,
    description: "",
    time: 60,
  },
  {
    url: "domestic-violence-post-2014",
    title: "Domestic Violence (post-2014)",
    data: domesticViolencePost2014,
    description: "",
    time: 60,
  },
];

const METROMAPS_URLS = METROMAPS.map((m) => m.url);
const METROMAPS_LENGTH = METROMAPS.length;
const METROMAPS_TIME = METROMAPS.map((m) => m.time);

export { METROMAPS_URLS, METROMAPS_LENGTH, METROMAPS_TIME };

export default METROMAPS;
