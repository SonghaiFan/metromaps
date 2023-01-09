// @satyaborg TODO: read data instead of importing
import noFilterView1 from "../data/05_04_2022/metromap_no_filter_n_neighbour_10_min_cluster_10.json";
import noFilterView2 from "../data/04_05_2022/20220503_no_filter_no_chunk_minlm.json";
import ukrRus from "../data/05_04_2022/ukr_rus_war.json";
import electionView from "../data/04_05_2022/election2.json";
import domesticViolence from "../data/01_07_2022/01_07_2022_1656654308.json";
import domesticViolencePre2014 from "../data/01_07_2022/01_07_2022_1656653072.json";
import domesticViolencePost2014 from "../data/01_07_2022/01_07_2022_1656653417.json";
import introPage from "../data/intro_page.json";
import allView from "../data/31_08_2022_1661913079_all_REDUCED.json";
import govView from "../data/21_09_2022_1663741409_gov.json";
import voiceView from "../data/21_09_2022_1663742238_voice.json";

// Give name, title, (description?) here after importing
const METROMAPS = [
  {
    url: "intros",
    title: "Quick Start Guide",
    data: introPage,
    description:
      "If you are new to using this tool, we suggest you make a start here. Discover what issues are being discussed in Australian news right now, which disadvantage issues are more common than others, and which ones co-occur.",
    subtitle: "The power of a ‘living platform’",
    hint: "Get tips on how to use this App and how we understand and discuss equity, opportunity, and disadvantage in 2022.",
    time: 30,
  },
  {
    url: "all",
    title: "All News",
    data: allView,
    description:
      "The news focused on Australian affairs, the pandemic, and women. People at its center, with questions about the housing & climate crisis, energy affordability, immigration policy, unemployment, democracy, living with COVID-19, and a First Nations Voice in the Constitution.",
    subtitle: "Building a better Australia?",
    hint: "Good policy demands open debate and inclusiveness. What communities and issues are we forgetting?",
    time: 60,
  },
  {
    url: "gov-assist-family-finance-work",
    title: "Government Assistance, Family relations, Finance, Work",
    data: govView,
    description:
      "The news focused on affordable housing, the number of deaths we are willing to accept in the ‘living with covid strategy’, the performance of Australian students compared to international benchmarks, and how to get fair wages for all while the costs of living increase.",
    subtitle: "Economic welfare and social wellbeing",
    hint: "Improving the wellbeing of people and families in Australia demands well-thought strategies.",
    time: 60,
  },
  {
    url: "voice-segregation-prejudice-discrimination-human-rights",
    title: "Voice, Segregation, Prejudice and discrimination, Human rights",
    data: voiceView,
    description:
      "News focused on religious discrimination laws, protecting gay students and men from perpetrators, improving the Australian police force and denormalising violence of any form, and the impact of the staying-at-home trend on people’s well-being and the after-covid recovery. ",
    subtitle: "The advantage of autonomy ",
    hint: "Let's build an Australia beyond discriminations, where we exercise our human rights.",
    time: 60,
  },
  // {
  //   url: "all-1",
  //   title: "All News (One Month Cycle)",
  //   data: noFilterView1,
  //   description:
  //     "Criminal case. In 2019, the police officer who killed an Aboriginal teenager even if the threat was low, was found not guilty of murder after 6 weeks of trial. Was systemic racism a factor in the incident? And what does it mean for the future Aboriginal community – Police relationships? Follow the discussions. (Feb - March 2022). Check the metro map. #normalisedexpressionofracism #murdertrial #aboriginal ",
  //   time: 60,
  // },
  // {
  //   url: "all-2",
  //   title: "All News (Two month Cycle)",
  //   data: noFilterView2,
  //   description:
  //     "What are the solutions to the Australian Housing Crisis, considering the rise of residential property prices through 2021, and the unaffordability of rental properties for minimum wage workers? Co-buying with the government? Social housing tax bill? Low deposit scheme? Follow the discussions. (Feb – April 2022). Check the metro map. #homeownership #propertyprices #landvalue #socialhousing #homelessness #financialstress #housingpolicy",
  //   time: 60,
  // },
  // {
  //   url: "election",
  //   title: "Election",
  //   data: electionView,
  //   description: "",
  //   time: 60,
  // },
  // {
  //   url: "ukr-rus-war",
  //   title: "Ukraine-Russia War",
  //   data: ukrRus,
  //   description: "",
  //   time: 60,
  // },
  // {
  //   url: "domestic-violence",
  //   title: "Domestic Violence (all)",
  //   data: domesticViolence,
  //   description: "",
  //   time: 60,
  // },
  // {
  //   url: "domestic-violence-pre-2014",
  //   title: "Domestic Violence (pre-2014)",
  //   data: domesticViolencePre2014,
  //   description: "",
  //   time: 60,
  // },
  // {
  //   url: "domestic-violence-post-2014",
  //   title: "Domestic Violence (post-2014)",
  //   data: domesticViolencePost2014,
  //   description: "",
  //   time: 60,
  // },
];

const METROMAPS_URLS = METROMAPS.map((m) => m.url);
const METROMAPS_LENGTH = METROMAPS.length;
const METROMAPS_TIME = METROMAPS.map((m) => m.time);

export { METROMAPS_URLS, METROMAPS_LENGTH, METROMAPS_TIME };

export default METROMAPS;
