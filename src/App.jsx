import { useState } from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Cell
} from "recharts";

// ── Excel report data ─────────────────────────────────────────────────────
const OVERVIEW = {
  totalSpend: "€55,122", installs: "12,184", roas: "1.01x",
  roi: "+0.6%", cpInstall: "€4.52", payback: "27d", installRate: "47.6%",
  months: [
    { month: "Jan 2026", spend: 16121, installs: 4491, revenue: 9095,  roas: 0.56, roi: -43.6, cpi: 3.59 },
    { month: "Feb 2026", spend: 26111, installs: 7015, revenue: 27032, roas: 1.04, roi: 3.5,   cpi: 3.72 },
    { month: "Mar 2026", spend: 12891, installs: 678,  revenue: 19350, roas: 1.50, roi: 50.1,  cpi: 19.01 },
  ],
};

const WEEKLY = [
  { week: "Jan 1–7",    spend: 1347,  revenue: 0,       installs: 0,    ir: 0.0,   roas: 0.00, cpi: null   },
  { week: "Jan 8–14",   spend: 2330,  revenue: 1168,    installs: 1101, ir: 61.8,  roas: 0.50, cpi: 2.12   },
  { week: "Jan 15–21",  spend: 2782,  revenue: 1972,    installs: 829,  ir: 64.3,  roas: 0.71, cpi: 3.36   },
  { week: "Jan 22–28",  spend: 4266,  revenue: 1972,    installs: 887,  ir: 37.7,  roas: 0.46, cpi: 4.81   },
  { week: "Jan 29–F4",  spend: 5396,  revenue: 3983,    installs: 1674, ir: 57.3,  roas: 0.74, cpi: 3.22   },
  { week: "Feb 5–11",   spend: 5144,  revenue: 5074,    installs: 1888, ir: 78.5,  roas: 0.99, cpi: 2.72   },
  { week: "Feb 12–18",  spend: 10708, revenue: 7314,    installs: 1716, ir: 39.0,  roas: 0.68, cpi: 6.24   },
  { week: "Feb 19–25",  spend: 7527,  revenue: 8112,    installs: 2237, ir: 91.9,  roas: 1.08, cpi: 3.36   },
  { week: "Feb 26–M4",  spend: 2732,  revenue: 6532,    installs: 1174, ir: 108.7, roas: 2.39, cpi: 2.33   },
  { week: "Mar 2–8",    spend: 6333,  revenue: 7945,    installs: 348,  ir: 12.3,  roas: 1.25, cpi: 18.20  },
  { week: "Mar 9–15",   spend: 6558,  revenue: 11405,   installs: 330,  ir: 11.1,  roas: 1.74, cpi: 19.87  },
];

const CAMPAIGN_TABLE = [
  { name: "web-CPA_age35-54",         spend: 56,    installs: 33,  cpi: 1.70,  ir: 206.2, roas: 4.67, roi: 367.1, roi1d: 0.47, roi7d: 0.58, roi30d: 0.67, roiAct: 0.97, arpu: 16.16, decision: "scale" },
  { name: "web2_age35-54_260226",      spend: 493,   installs: 301, cpi: 1.64,  ir: 85.3,  roas: 4.10, roi: 310.4, roi1d: 0.32, roi7d: 0.47, roi30d: 1.31, roiAct: 0.59, arpu: 8.01,  decision: "scale" },
  { name: "FR_web-VO_broad_100226",    spend: 128,   installs: 63,  cpi: 2.04,  ir: 98.4,  roas: 3.57, roi: 257.2, roi1d: 0.75, roi7d: 1.34, roi30d: 1.55, roiAct: 1.11, arpu: 32.82, decision: "scale" },
  { name: "web-VO_broad_260226",       spend: 480,   installs: 100, cpi: 4.80,  ir: 88.5,  roas: 2.62, roi: 162.4, roi1d: 0.25, roi7d: 0.40, roi30d: 0.47, roiAct: 0.61, arpu: 18.75, decision: "scale" },
  { name: "web-VO_age35-54_090226",    spend: 3231,  installs: 720, cpi: 4.49,  ir: 79.8,  roas: 2.26, roi: 126.0, roi1d: 0.45, roi7d: 0.72, roi30d: 0.92, roiAct: 0.73, arpu: 369.84,decision: "scale" },
  { name: "webABC-test_age35-54",      spend: 751,   installs: 154, cpi: 4.88,  ir: 43.4,  roas: 2.12, roi: 112.3, roi1d: 0.32, roi7d: 0.46, roi30d: 0.52, roiAct: 0.58, arpu: 12.59, decision: "scale" },
  { name: "web2_age35-54_040326",      spend: 1203,  installs: 183, cpi: 6.58,  ir: 26.8,  roas: 1.84, roi: 84.1,  roi1d: 0.40, roi7d: 0.60, roi30d: 0.63, roiAct: 0.65, arpu: 11.99, decision: "scale" },
  { name: "web_age35-54_260226",       spend: 738,   installs: 253, cpi: 2.92,  ir: 77.6,  roas: 1.67, roi: 67.2,  roi1d: 0.28, roi7d: 0.41, roi30d: 0.47, roiAct: 0.42, arpu: 5.78,  decision: "scale" },
  { name: "FR_web-VO_broad_170226",    spend: 260,   installs: 120, cpi: 2.16,  ir: 85.7,  roas: 1.58, roi: 57.6,  roi1d: 0.45, roi7d: 0.80, roi30d: 0.87, roiAct: 0.70, arpu: 13.81, decision: "scale" },
  { name: "web_broad_140126",          spend: 3998,  installs: 1773,cpi: 2.26,  ir: 58.8,  roas: 1.48, roi: 48.5,  roi1d: 0.55, roi7d: 0.81, roi30d: 1.24, roiAct: 0.90, arpu: 109.50,decision: "scale" },
  { name: "web-VO_broad_200126",       spend: 3716,  installs: 938, cpi: 3.96,  ir: 70.8,  roas: 1.48, roi: 48.0,  roi1d: 0.48, roi7d: 0.69, roi30d: 1.08, roiAct: 0.73, arpu: 176.80,decision: "scale" },
  { name: "web-VO_broad_060226",       spend: 7257,  installs: 1213,cpi: 5.98,  ir: 79.9,  roas: 1.31, roi: 31.3,  roi1d: 0.30, roi7d: 0.45, roi30d: 0.63, roiAct: 0.59, arpu: 6.72,  decision: "scale" },
  { name: "web3Short_age35-54",        spend: 783,   installs: 120, cpi: 6.53,  ir: 28.8,  roas: 1.14, roi: 13.5,  roi1d: 0.26, roi7d: 0.41, roi30d: 0.43, roiAct: 0.33, arpu: 41.16, decision: "watch" },
  { name: "web_age35-54_290126",       spend: 9055,  installs: 2955,cpi: 3.06,  ir: 62.2,  roas: 1.04, roi: 4.0,   roi1d: 0.45, roi7d: 0.64, roi30d: 0.81, roiAct: 0.71, arpu: 2.58,  decision: "watch" },
  { name: "web_LAL1_1gPurch_270126",   spend: 728,   installs: 178, cpi: 4.09,  ir: 59.3,  roas: 1.09, roi: 9.4,   roi1d: 0.36, roi7d: 0.54, roi30d: 0.68, roiAct: 0.77, arpu: 4.80,  decision: "watch" },
  { name: "FR_web-VO_broad_060226",    spend: 533,   installs: 178, cpi: 3.00,  ir: 100.6, roas: 1.10, roi: 9.8,   roi1d: 1.72, roi7d: 2.52, roi30d: 2.56, roiAct: 7.41, arpu: 14.08, decision: "watch" },
  { name: "FR_web_broad_040226",       spend: 611,   installs: 530, cpi: 1.15,  ir: 76.7,  roas: 0.86, roi: -14.1, roi1d: 0.43, roi7d: 0.60, roi30d: 0.71, roiAct: 0.73, arpu: 1.08,  decision: "pause" },
  { name: "web_broad_010126",          spend: 1909,  installs: 866, cpi: 2.20,  ir: 54.6,  roas: 0.76, roi: -23.7, roi1d: 0.36, roi7d: 0.58, roi30d: 0.79, roiAct: 0.60, arpu: 2.07,  decision: "pause" },
  { name: "web2-VO_broad_120226",      spend: 1360,  installs: 80,  cpi: 17.00, ir: 16.2,  roas: 0.43, roi: -57.2, roi1d: 0.15, roi7d: 0.27, roi30d: 0.30, roiAct: 0.28, arpu: 4.95,  decision: "pause" },
  { name: "web2_age35-54_120226",      spend: 1390,  installs: 140, cpi: 9.93,  ir: 13.4,  roas: 0.28, roi: -71.6, roi1d: 0.13, roi7d: 0.20, roi30d: 0.25, roiAct: 0.18, arpu: 2.14,  decision: "pause" },
];


const DATE_ORDER = [
  "Feb 12","Feb 13","Feb 14","Feb 15","Feb 16","Feb 17","Feb 18","Feb 19","Feb 20","Feb 21","Feb 22","Feb 23","Feb 24","Feb 25","Feb 26","Feb 27","Feb 28",
  "Mar 01","Mar 02","Mar 03","Mar 04","Mar 05","Mar 06","Mar 07","Mar 08","Mar 09",
  "Mar 10","Mar 11","Mar 12","Mar 13","Mar 14","Mar 15","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 21","Mar 22","Mar 23","Mar 24","Mar 25"
];

function d(date, r, c, i) { return { date, r, c, i }; }
function v(date, val) { return { date, v: val }; }

const CAMPAIGNS = [

  { id:"web2_age35-54_040326", group:"web2_age35-54", geo:"US", label:"040326",
    ir:  [d("Mar 04",13.89,72,10),d("Mar 05",14.81,324,48),d("Mar 06",17.3,289,50),d("Mar 07",15.05,319,48),d("Mar 08",16.94,372,63),d("Mar 09",14.2,345,49),d("Mar 10",14.17,367,52),d("Mar 11",13.71,321,44),d("Mar 12",17.14,315,54),d("Mar 13",14.43,305,44),d("Mar 14",16.84,291,49),d("Mar 15",18.82,457,86),d("Mar 16",15.84,385,61),d("Mar 17",13.25,400,53),d("Mar 18",13.83,376,52),d("Mar 19",10.27,370,38),d("Mar 20",13.47,349,47),d("Mar 21",11.53,347,40),d("Mar 22",13.03,445,58),d("Mar 23",12.71,425,54),d("Mar 24",10.84,369,40),d("Mar 25",11.01,336,37)],
    cpi: [v("Mar 04",7.42),v("Mar 05",5.41),v("Mar 06",4.4),v("Mar 07",4.76),v("Mar 08",4.41),v("Mar 09",5.0),v("Mar 10",4.91),v("Mar 11",4.84),v("Mar 12",3.74),v("Mar 13",4.82),v("Mar 14",4.25),v("Mar 15",3.21),v("Mar 16",3.96),v("Mar 17",4.26),v("Mar 18",4.25),v("Mar 19",5.25),v("Mar 20",4.46),v("Mar 21",5.78),v("Mar 22",4.52),v("Mar 23",4.63),v("Mar 24",5.7),v("Mar 25",6.37)],
    roi: [v("Mar 04",0.1348),v("Mar 05",0.2273),v("Mar 06",0.4958),v("Mar 07",0.3454),v("Mar 08",0.2684),v("Mar 09",0.3332),v("Mar 10",0.1794),v("Mar 11",0.2971),v("Mar 12",0.4819),v("Mar 13",0.5622),v("Mar 14",0.545),v("Mar 15",0.6771),v("Mar 16",0.3118),v("Mar 17",0.5291),v("Mar 18",0.4506),v("Mar 19",0.2683),v("Mar 20",0.4616),v("Mar 21",0.2523),v("Mar 22",0.2983),v("Mar 23",0.1998),v("Mar 24",0.2612),v("Mar 25",0.2228)] },

  { id:"web2CPA_install_age35-54_180326", group:"web2CPA[install]_age35-54", geo:"US", label:"180326",
    ir:  [d("Mar 18",6.74,89,6),d("Mar 19",6.55,229,15),d("Mar 20",9.39,213,20),d("Mar 21",11.76,153,18),d("Mar 22",18.12,149,27),d("Mar 23",12.94,201,26),d("Mar 24",14.07,135,19),d("Mar 25",18.01,161,29)],
    cpi: [v("Mar 18",8.21),v("Mar 19",7.23),v("Mar 20",6.96),v("Mar 21",5.01),v("Mar 22",4.7),v("Mar 23",5.55),v("Mar 24",5.87),v("Mar 25",3.95)],
    roi: [v("Mar 18",0.1421),v("Mar 19",0.1291),v("Mar 20",0.6638),v("Mar 21",0.4983),v("Mar 22",0.2634),v("Mar 23",0.2874),v("Mar 24",0.2645),v("Mar 25",0.4497)] },

  { id:"web3Short_age35-54_060326", group:"web3Short_age35-54", geo:"US", label:"060326",
    ir:  [d("Mar 06",14.06,64,9),d("Mar 07",15.83,278,44),d("Mar 08",10.98,337,37),d("Mar 09",13.26,347,46),d("Mar 10",11.37,422,48),d("Mar 11",10.32,339,35),d("Mar 12",14.54,282,41),d("Mar 13",15.0,300,45),d("Mar 14",15.62,256,40),d("Mar 15",15.28,288,44)],
    cpi: [v("Mar 06",5.82),v("Mar 07",5.38),v("Mar 08",7.55),v("Mar 09",5.46),v("Mar 10",5.3),v("Mar 11",5.96),v("Mar 12",4.9),v("Mar 13",4.73),v("Mar 14",5.12),v("Mar 15",5.29)],
    roi: [v("Mar 06",0.0764),v("Mar 07",0.3628),v("Mar 08",0.2253),v("Mar 09",0.2532),v("Mar 10",0.2201),v("Mar 11",0.2396),v("Mar 12",0.3381),v("Mar 13",0.2562),v("Mar 14",0.2318),v("Mar 15",0.2511)] },

  { id:"web3Short-CPA_090326", group:"web3Short-CPA", geo:"US", label:"090326",
    ir:  [d("Mar 09",13.89,252,35),d("Mar 10",12.77,235,30),d("Mar 11",9.27,205,19),d("Mar 12",11.37,255,29),d("Mar 13",0.58,690,4),d("Mar 14",0.09,1107,1)],
    cpi: [v("Mar 09",6.73),v("Mar 10",6.65),v("Mar 11",13.56),v("Mar 12",8.55),v("Mar 13",46.38),v("Mar 14",157.45)],
    roi: [v("Mar 09",0.2431),v("Mar 10",0.2232),v("Mar 11",0.0815),v("Mar 12",0.2748),v("Mar 13",0.0243),v("Mar 14",0.0)] },

  { id:"webABC-test_age35-54_040326", group:"webABC-test_age35-54", geo:"US", label:"040326",
    ir:  [d("Mar 04",14.34,251,36),d("Mar 05",17.28,648,112),d("Mar 06",14.22,633,90),d("Mar 07",17.63,641,113),d("Mar 08",16.95,761,129),d("Mar 09",17.91,793,142),d("Mar 10",18.08,437,79)],
    cpi: [v("Mar 04",5.77),v("Mar 05",4.64),v("Mar 06",5.68),v("Mar 07",4.58),v("Mar 08",4.88),v("Mar 09",3.88),v("Mar 10",4.04)],
    roi: [v("Mar 04",0.1443),v("Mar 05",0.2491),v("Mar 06",0.1769),v("Mar 07",0.4844),v("Mar 08",0.2762),v("Mar 09",0.3671),v("Mar 10",0.3027)] },

  { id:"web-CPA_age35-54_060326", group:"web-CPA_age35-54", geo:"US", label:"060326",
    ir:  [d("Mar 06",17.42,155,27),d("Mar 07",12.1,248,30),d("Mar 08",17.45,235,41),d("Mar 09",15.38,65,10)],
    cpi: [v("Mar 06",5.35),v("Mar 07",7.01),v("Mar 08",5.87),v("Mar 09",6.47)],
    roi: [v("Mar 06",0.2136),v("Mar 07",0.1307),v("Mar 08",0.3034),v("Mar 09",0.4443)] },

  { id:"web-VO_broad_040326", group:"web-VO_broad", geo:"US", label:"040326",
    ir:  [d("Mar 04",21.3,108,23),d("Mar 05",12.62,206,26),d("Mar 06",12.78,180,23)],
    cpi: [v("Mar 04",5.51),v("Mar 05",8.83),v("Mar 06",7.77)],
    roi: [v("Mar 04",0.3391),v("Mar 05",0.2171),v("Mar 06",0.1583)] },

  { id:"web_age35-54_260226", group:"web_age35-54", geo:"US", label:"260226",
    ir:  [d("Feb 26",17.83,157,28),d("Feb 27",15.79,285,45),d("Feb 28",17.0,300,51),d("Mar 01",15.31,431,66),d("Mar 02",17.33,404,70),d("Mar 03",16.76,346,58),d("Mar 04",20.69,319,66),d("Mar 05",16.51,321,53),d("Mar 06",19.18,245,47)],
    cpi: [v("Feb 26",4.68),v("Feb 27",5.76),v("Feb 28",3.82),v("Mar 01",4.35),v("Mar 02",3.28),v("Mar 03",4.11),v("Mar 04",3.39),v("Mar 05",4.05),v("Mar 06",3.66)],
    roi: [v("Feb 26",0.1527),v("Feb 27",0.2127),v("Feb 28",0.3721),v("Mar 01",0.1201),v("Mar 02",0.357),v("Mar 03",0.4061),v("Mar 04",0.3715),v("Mar 05",0.1629),v("Mar 06",0.4755)] },

  { id:"web-VO_broad_260226", group:"web-VO_broad", geo:"US", label:"260226",
    ir:  [d("Feb 26",15.05,93,14),d("Feb 27",11.59,207,24),d("Feb 28",9.31,247,23),d("Mar 01",10.55,237,25),d("Mar 02",12.36,275,34),d("Mar 03",11.58,259,30),d("Mar 04",14.89,94,14)],
    cpi: [v("Feb 26",8.4),v("Feb 27",9.66),v("Feb 28",10.23),v("Mar 01",10.11),v("Mar 02",6.98),v("Mar 03",7.6),v("Mar 04",6.77)],
    roi: [v("Feb 26",0.3828),v("Feb 27",0.345),v("Feb 28",0.1615),v("Mar 01",0.2433),v("Mar 02",0.234),v("Mar 03",0.2052),v("Mar 04",0.306)] },

  { id:"web2_age35-54_260226", group:"web2_age35-54", geo:"US", label:"260226",
    ir:  [d("Feb 26",14.78,115,17),d("Feb 27",15.79,342,54),d("Feb 28",13.79,899,124),d("Mar 01",12.43,571,71),d("Mar 02",11.65,455,53),d("Mar 03",19.0,442,84),d("Mar 04",15.57,167,26)],
    cpi: [v("Feb 26",15.78),v("Feb 27",7.59),v("Feb 28",3.29),v("Mar 01",3.86),v("Mar 02",4.37),v("Mar 03",2.9),v("Mar 04",3.84)],
    roi: [v("Feb 26",0.0466),v("Feb 27",0.2014),v("Feb 28",0.4001),v("Mar 01",0.4504),v("Mar 02",0.2245),v("Mar 03",0.4355),v("Mar 04",0.5105)] },

  { id:"web-VO_broad_060226", group:"web-VO_broad", geo:"US", label:"060226",
    ir:  [d("Feb 12",20.43,230,47),d("Feb 13",15.03,193,29),d("Feb 14",21.28,329,70),d("Feb 15",24.27,375,91),d("Feb 17",15.29,497,76),d("Feb 18",17.04,493,84),d("Feb 19",15.79,494,78),d("Feb 20",11.48,392,45),d("Feb 21",16.12,428,69),d("Feb 22",10.58,501,53),d("Feb 23",11.48,540,62),d("Feb 24",14.51,379,55),d("Feb 25",8.33,180,15),d("Feb 26",8.33,60,5)],
    cpi: [v("Feb 12",5.15),v("Feb 13",7.92),v("Feb 14",5.15),v("Feb 15",4.19),v("Feb 17",7.73),v("Feb 18",6.92),v("Feb 19",7.44),v("Feb 20",12.68),v("Feb 21",8.74),v("Feb 22",11.74),v("Feb 23",9.82),v("Feb 24",7.91),v("Feb 25",15.45),v("Feb 26",17.24)],
    roi: [v("Feb 12",0.2976),v("Feb 13",0.2181),v("Feb 14",0.4641),v("Feb 15",0.6168),v("Feb 17",0.2173),v("Feb 18",0.3428),v("Feb 19",0.2509),v("Feb 20",0.057),v("Feb 21",0.2146),v("Feb 22",0.2404),v("Feb 23",0.208),v("Feb 24",0.216),v("Feb 25",0.0928),v("Feb 26",0.0464)] },

  { id:"web_age35-54_290126", group:"web_age35-54", geo:"US", label:"290126",
    ir:  [d("Feb 12",14.83,445,66),d("Feb 13",15.14,601,91),d("Feb 14",16.28,737,120),d("Feb 15",15.81,860,136),d("Feb 17",14.29,1162,166),d("Feb 18",14.74,1126,166),d("Feb 19",15.58,1136,177),d("Feb 20",14.53,1108,161),d("Feb 21",13.42,1095,147),d("Feb 22",13.81,1296,179),d("Feb 23",15.47,1202,186),d("Feb 24",14.74,1072,158),d("Feb 25",16.12,794,128),d("Feb 26",17.98,89,16)],
    cpi: [v("Feb 12",3.48),v("Feb 13",3.57),v("Feb 14",3.53),v("Feb 15",3.47),v("Feb 17",3.96),v("Feb 18",4.26),v("Feb 19",3.8),v("Feb 20",4.12),v("Feb 21",4.62),v("Feb 22",4.36),v("Feb 23",3.91),v("Feb 24",4.28),v("Feb 25",3.85),v("Feb 26",4.46)],
    roi: [v("Feb 12",0.4267),v("Feb 13",0.3232),v("Feb 14",0.2974),v("Feb 15",0.5671),v("Feb 17",0.2467),v("Feb 18",0.2781),v("Feb 19",0.3992),v("Feb 20",0.2674),v("Feb 21",0.308),v("Feb 22",0.2893),v("Feb 23",0.472),v("Feb 24",0.1796),v("Feb 25",0.289),v("Feb 26",0.5373)] },
];

const LINE_COLORS = ["#38bdf8","#f472b6","#4ade80","#fb923c","#a78bfa"];

const groupMap = {};
for (const c of CAMPAIGNS) {
  if (!groupMap[c.group]) groupMap[c.group] = { geo: c.geo, campaigns: [] };
  groupMap[c.group].campaigns.push(c);
}

function buildChartData(campaigns, metric) {
  const map = {};
  for (const c of campaigns) {
    for (const d of c[metric]) {
      if (!map[d.date]) map[d.date] = { date: d.date };
      map[d.date][c.id] = metric === "ir" ? d.r : d.v;
      if (metric === "ir") map[d.date]["_meta_" + c.id] = { clicks: d.c, installs: d.i };
    }
  }
  return Object.values(map).sort((a, b) => DATE_ORDER.indexOf(a.date) - DATE_ORDER.indexOf(b.date));
}

function groupAvg(campaigns, metric) {
  const all = campaigns.flatMap(c => c[metric].map(d => metric === "ir" ? d.r : d.v));
  if (!all.length) return null;
  return all.reduce((s, x) => s + x, 0) / all.length;
}

const PAGES = [
  { id:"ir",  label:"Install Rate", desc:"Click-to-install rate",          accent:"#7dd3fc",
    fmt: v=>`${v.toFixed(1)}%`,        yFmt: v=>`${v}%`,        avgFmt: v=>`${v.toFixed(1)}%`  },
  { id:"cpi", label:"eCPI",         desc:"Effective cost per install",      accent:"#fb923c",
    fmt: v=>`$${v.toFixed(2)}`,        yFmt: v=>`$${v}`,        avgFmt: v=>`$${v.toFixed(2)}`  },
  { id:"roi", label:"Ad ROI 1d",    desc:"Ad return on investment (1-day)", accent:"#4ade80",
    fmt: v=>`${(v*100).toFixed(1)}%`,  yFmt: v=>`${Math.round(v*100)}%`, avgFmt: v=>`${(v*100).toFixed(1)}%` },
];

const TOP_PAGES = [
  { id:"overview", label:"Overview",   accent:"#a78bfa" },
  { id:"campaigns",label:"Campaigns",  accent:"#f472b6" },
  { id:"daily",    label:"Daily Charts",accent:"#38bdf8" },
];

function MetricTooltip({ active, payload, label, campaigns, page }) {
  if (!active || !payload?.length) return null;
  const pg = PAGES.find(p => p.id === page);
  return (
    <div style={{ background:"#1a2234", border:"1px solid #2d3748", borderRadius:8, padding:"10px 14px", fontSize:12, color:"#e2e8f0" }}>
      <div style={{ fontWeight:700, marginBottom:6, color:"#64748b", fontSize:11 }}>{label}</div>
      {payload.filter(p => p.value != null).map((p, i) => {
        const c = campaigns.find(c => c.id === p.dataKey);
        const meta = page === "ir" ? p.payload["_meta_" + p.dataKey] : null;
        return (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:p.color, flexShrink:0 }} />
            <span style={{ color:"#94a3b8", fontFamily:"monospace", fontSize:11 }}>{c?.label}</span>
            <span style={{ fontWeight:700, color:"#f1f5f9" }}>{pg.fmt(p.value)}</span>
            {meta && <span style={{ color:"#475569", fontSize:10 }}>({meta.installs}/{meta.clicks})</span>}
          </div>
        );
      })}
    </div>
  );
}

function GroupCard({ groupName, geo, campaigns, page }) {
  const pg = PAGES.find(p => p.id === page);
  const active = campaigns.filter(c => c[page].length > 0);

  if (!active.length) return (
    <div style={{ background:"#141b2d", border:"1px solid #1e2a3a", borderRadius:14, padding:"20px 24px", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", minHeight:100, gap:6 }}>
      <div style={{ fontSize:10, color:"#4b5e75", fontWeight:700, letterSpacing:1, textTransform:"uppercase" }}>iOS · {geo}</div>
      <div style={{ fontSize:15, color:"#f1f5f9", fontWeight:800, fontFamily:"monospace" }}>{groupName}</div>
      <div style={{ fontSize:12, color:"#2d3f55", marginTop:2 }}>No data for this metric</div>
    </div>
  );

  const chartData = buildChartData(active, page);
  const avg = groupAvg(active, page) ?? 0;
  const allVals = active.flatMap(c => c[page].map(d => page === "ir" ? d.r : d.v));
  const yMax = Math.ceil(Math.max(...allVals) * 1.25);

  return (
    <div style={{ background:"#141b2d", border:"1px solid #1e2a3a", borderRadius:14, padding:"20px 24px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
        <div>
          <div style={{ fontSize:10, color:"#4b5e75", fontWeight:700, letterSpacing:1, textTransform:"uppercase", marginBottom:3 }}>iOS · {geo}</div>
          <div style={{ fontSize:15, color:"#f1f5f9", fontWeight:800, fontFamily:"monospace" }}>{groupName}</div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:10, color:"#4b5e75", textTransform:"uppercase", letterSpacing:0.5 }}>Avg</div>
          <div style={{ fontSize:20, fontWeight:800, color:pg.accent }}>{pg.avgFmt(avg)}</div>
        </div>
      </div>

      <div style={{ display:"flex", gap:14, marginBottom:10, flexWrap:"wrap" }}>
        {active.map((c, i) => (
          <div key={c.id} style={{ display:"flex", alignItems:"center", gap:5 }}>
            <svg width="20" height="10">
              <line x1="0" y1="5" x2="20" y2="5" stroke={LINE_COLORS[i%LINE_COLORS.length]} strokeWidth="2.5"/>
              <circle cx="10" cy="5" r="2.5" fill={LINE_COLORS[i%LINE_COLORS.length]}/>
            </svg>
            <span style={{ fontSize:11, color:"#94a3b8", fontFamily:"monospace" }}>{c.label}</span>
          </div>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={175}>
        <LineChart data={chartData} margin={{ top:4, right:6, left:-10, bottom:0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1a2535" vertical={false}/>
          <XAxis dataKey="date" tick={{ fill:"#4b5e75", fontSize:9 }} axisLine={false} tickLine={false} interval="preserveStartEnd"/>
          <YAxis domain={[0, yMax]} tick={{ fill:"#4b5e75", fontSize:10 }} axisLine={false} tickLine={false} tickFormatter={pg.yFmt}/>
          <Tooltip content={<MetricTooltip campaigns={active} page={page}/>}/>
          <ReferenceLine y={avg} stroke="#2d3f55" strokeDasharray="4 3"/>
          {active.map((c, i) => (
            <Line key={c.id} type="monotone" dataKey={c.id}
              stroke={LINE_COLORS[i%LINE_COLORS.length]} strokeWidth={2}
              dot={{ fill:LINE_COLORS[i%LINE_COLORS.length], r:2.5, strokeWidth:0 }}
              activeDot={{ r:5, stroke:"#141b2d", strokeWidth:2 }}
              connectNulls={false}/>
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}


// ── Overview Page ─────────────────────────────────────────────────────────
function OverviewPage() {
  const colors = { spend:"#fb923c", revenue:"#4ade80", installs:"#38bdf8" };
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
      {/* KPI tiles */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))", gap:12 }}>
        {[
          { label:"Total Spend",    value:OVERVIEW.totalSpend, color:"#fb923c" },
          { label:"Installs",       value:OVERVIEW.installs,   color:"#38bdf8" },
          { label:"ROAS",           value:OVERVIEW.roas,       color:"#4ade80" },
          { label:"ROI",            value:OVERVIEW.roi,        color:"#4ade80" },
          { label:"CP Install",     value:OVERVIEW.cpInstall,  color:"#fbbf24" },
          { label:"Avg Payback",    value:OVERVIEW.payback,    color:"#a78bfa" },
          { label:"Install Rate",   value:OVERVIEW.installRate,color:"#7dd3fc" },
        ].map((k,i) => (
          <div key={i} style={{ background:"#141b2d", border:"1px solid #1e2a3a", borderRadius:12, padding:"16px 18px" }}>
            <div style={{ fontSize:10, color:"#4b5e75", textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>{k.label}</div>
            <div style={{ fontSize:22, fontWeight:800, color:k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Status banner */}
      <div style={{ background:"#1e2d45", border:"1px solid #fbbf2433", borderRadius:12, padding:"14px 20px", fontSize:13, color:"#fbbf24" }}>
        ⚠️ Not yet profitable — ROAS 1.01x · ROI +0.6% · Target ≥ 1.2x · Jan 1 – Mar 15, 2026
      </div>

      {/* Monthly breakdown + ROAS chart side by side */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <div style={{ background:"#141b2d", border:"1px solid #1e2a3a", borderRadius:12, padding:"18px 20px" }}>
          <div style={{ fontSize:12, color:"#4b5e75", fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:14 }}>Monthly Breakdown</div>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
            <thead>
              <tr style={{ color:"#475569" }}>
                {["Month","Spend","Installs","Revenue","ROAS","ROI%","CPI"].map(h => (
                  <th key={h} style={{ textAlign:"right", paddingBottom:8, fontWeight:600, paddingRight:8 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {OVERVIEW.months.map((m,i) => (
                <tr key={i} style={{ borderTop:"1px solid #1e2a3a" }}>
                  <td style={{ padding:"8px 8px 8px 0", color:"#94a3b8", fontWeight:600 }}>{m.month}</td>
                  <td style={{ textAlign:"right", color:"#fb923c", paddingRight:8 }}>€{m.spend.toLocaleString()}</td>
                  <td style={{ textAlign:"right", color:"#38bdf8", paddingRight:8 }}>{m.installs.toLocaleString()}</td>
                  <td style={{ textAlign:"right", color:"#4ade80", paddingRight:8 }}>${m.revenue.toLocaleString()}</td>
                  <td style={{ textAlign:"right", color: m.roas >= 1.2 ? "#4ade80" : m.roas >= 1.0 ? "#fbbf24" : "#f87171", fontWeight:700, paddingRight:8 }}>{m.roas}x</td>
                  <td style={{ textAlign:"right", color: m.roi > 0 ? "#4ade80" : "#f87171", fontWeight:700, paddingRight:8 }}>{m.roi > 0 ? "+" : ""}{m.roi}%</td>
                  <td style={{ textAlign:"right", color:"#94a3b8" }}>€{m.cpi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ background:"#141b2d", border:"1px solid #1e2a3a", borderRadius:12, padding:"18px 20px" }}>
          <div style={{ fontSize:12, color:"#4b5e75", fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:14 }}>Monthly ROAS</div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={OVERVIEW.months} margin={{ top:4, right:4, left:-20, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2535" vertical={false}/>
              <XAxis dataKey="month" tick={{ fill:"#4b5e75", fontSize:10 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill:"#4b5e75", fontSize:10 }} axisLine={false} tickLine={false} tickFormatter={v => v+"x"}/>
              <Tooltip formatter={(v) => [`${v}x`, "ROAS"]} contentStyle={{ background:"#1a2234", border:"1px solid #2d3748", borderRadius:8, fontSize:12 }}/>
              <ReferenceLine y={1.2} stroke="#fbbf24" strokeDasharray="4 3" label={{ value:"Target 1.2x", fill:"#fbbf24", fontSize:10, position:"right" }}/>
              <Bar dataKey="roas" radius={[4,4,0,0]}>
                {OVERVIEW.months.map((m,i) => <Cell key={i} fill={m.roas >= 1.2 ? "#4ade80" : m.roas >= 1.0 ? "#fbbf24" : "#f87171"}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weekly table */}
      <div style={{ background:"#141b2d", border:"1px solid #1e2a3a", borderRadius:12, padding:"18px 20px" }}>
        <div style={{ fontSize:12, color:"#4b5e75", fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:14 }}>Weekly Performance</div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11, whiteSpace:"nowrap" }}>
            <thead>
              <tr style={{ color:"#475569" }}>
                {["Week","Spend","Revenue","Installs","Install Rate","CPI","ROAS"].map(h => (
                  <th key={h} style={{ textAlign:"right", paddingBottom:8, fontWeight:600, paddingRight:12 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {WEEKLY.map((w,i) => (
                <tr key={i} style={{ borderTop:"1px solid #1e2a3a" }}>
                  <td style={{ padding:"7px 12px 7px 0", color:"#64748b", fontFamily:"monospace", fontSize:10 }}>{w.week}</td>
                  <td style={{ textAlign:"right", paddingRight:12, color:"#fb923c" }}>€{w.spend.toLocaleString()}</td>
                  <td style={{ textAlign:"right", paddingRight:12, color:"#4ade80" }}>${w.revenue.toLocaleString()}</td>
                  <td style={{ textAlign:"right", paddingRight:12, color:"#38bdf8" }}>{w.installs.toLocaleString()}</td>
                  <td style={{ textAlign:"right", paddingRight:12, color:"#7dd3fc" }}>{w.ir.toFixed(1)}%</td>
                  <td style={{ textAlign:"right", paddingRight:12, color:"#94a3b8" }}>{w.cpi ? "€"+w.cpi : "—"}</td>
                  <td style={{ textAlign:"right", paddingRight:0, fontWeight:700, color: w.roas >= 1.2 ? "#4ade80" : w.roas >= 1.0 ? "#fbbf24" : "#f87171" }}>{w.roas.toFixed(2)}x</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Campaigns Page ────────────────────────────────────────────────────────
function CampaignsPage() {
  const [sort, setSort] = useState("roas");
  const sorted = [...CAMPAIGN_TABLE].sort((a,b) => b[sort] - a[sort]);
  const decisionStyle = { scale:{ color:"#4ade80", bg:"#14532d22", border:"#4ade8033" }, watch:{ color:"#fbbf24", bg:"#78350f22", border:"#fbbf2433" }, pause:{ color:"#f87171", bg:"#7f1d1d22", border:"#f8717133" } };
  const sortBtn = (key, label) => (
    <button onClick={() => setSort(key)} style={{ padding:"4px 10px", borderRadius:6, border:"none", cursor:"pointer", fontSize:11, fontWeight:700, background: sort===key ? "#1e2d45" : "transparent", color: sort===key ? "#f472b6" : "#4b5e75" }}>{label}</button>
  );
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div style={{ display:"flex", gap:4, alignItems:"center" }}>
        <span style={{ fontSize:11, color:"#4b5e75", marginRight:6 }}>Sort by:</span>
        {sortBtn("roas","ROAS")} {sortBtn("roi","ROI%")} {sortBtn("installs","Installs")} {sortBtn("ir","Install Rate")} {sortBtn("arpu","ARPU")}
      </div>
      <div style={{ background:"#141b2d", border:"1px solid #1e2a3a", borderRadius:12, overflow:"hidden" }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11 }}>
            <thead>
              <tr style={{ background:"#0d1117", color:"#475569" }}>
                {["Campaign","Spend","Installs","CPI","Install Rate","ROAS","ROI%","ROI 1d","ROI 7d","ROI 30d","ROI Act.","ARPU","Decision"].map(h => (
                  <th key={h} style={{ textAlign:"right", padding:"10px 12px", fontWeight:600, whiteSpace:"nowrap", textAlign: h==="Campaign"||h==="Decision" ? "left" : "right" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((c,i) => {
                const ds = decisionStyle[c.decision];
                return (
                  <tr key={i} style={{ borderTop:"1px solid #1e2a3a", background: i%2===0 ? "transparent" : "#0d111733" }}>
                    <td style={{ padding:"8px 12px", color:"#e2e8f0", fontFamily:"monospace", fontSize:10, whiteSpace:"nowrap" }}>{c.name}</td>
                    <td style={{ textAlign:"right", padding:"8px 12px", color:"#fb923c" }}>€{c.spend.toLocaleString()}</td>
                    <td style={{ textAlign:"right", padding:"8px 12px", color:"#38bdf8" }}>{c.installs.toLocaleString()}</td>
                    <td style={{ textAlign:"right", padding:"8px 12px", color:"#94a3b8" }}>€{c.cpi.toFixed(2)}</td>
                    <td style={{ textAlign:"right", padding:"8px 12px", color:"#7dd3fc" }}>{c.ir.toFixed(1)}%</td>
                    <td style={{ textAlign:"right", padding:"8px 12px", fontWeight:700, color: c.roas>=1.2?"#4ade80":c.roas>=1.0?"#fbbf24":"#f87171" }}>{c.roas.toFixed(2)}x</td>
                    <td style={{ textAlign:"right", padding:"8px 12px", fontWeight:700, color: c.roi>0?"#4ade80":"#f87171" }}>{c.roi>0?"+":""}{c.roi.toFixed(1)}%</td>
                    <td style={{ textAlign:"right", padding:"8px 12px", color:"#94a3b8" }}>{c.roi1d.toFixed(2)}x</td>
                    <td style={{ textAlign:"right", padding:"8px 12px", color:"#94a3b8" }}>{c.roi7d.toFixed(2)}x</td>
                    <td style={{ textAlign:"right", padding:"8px 12px", color:"#94a3b8" }}>{c.roi30d.toFixed(2)}x</td>
                    <td style={{ textAlign:"right", padding:"8px 12px", color:"#a78bfa", fontWeight:700 }}>{c.roiAct.toFixed(2)}x</td>
                    <td style={{ textAlign:"right", padding:"8px 12px", color:"#fbbf24" }}>${c.arpu.toFixed(2)}</td>
                    <td style={{ padding:"8px 12px" }}>
                      <span style={{ background:ds.bg, color:ds.color, border:`1px solid ${ds.border}`, borderRadius:20, padding:"2px 8px", fontSize:10, fontWeight:700 }}>
                        {c.decision === "scale" ? "✓ Scale" : c.decision === "watch" ? "~ Watch" : "✕ Pause"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div style={{ fontSize:11, color:"#2d3f55" }}>Jan 1 – Mar 15, 2026 · ROAS = Ad Revenue / Ad Spend · ROI Act. = lifetime return per cohort</div>
    </div>
  );
}

export default function App() {
  const [topPage, setTopPage] = useState("overview");
  const [dailyPage, setDailyPage] = useState("ir");
  const groups = Object.entries(groupMap);
  const currentDailyPage = PAGES.find(p => p.id === dailyPage);

  return (
    <div style={{ minHeight:"100vh", background:"#0d1117", color:"#e2e8f0", fontFamily:"-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", padding:"32px 24px" }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom:28 }}>
          <div style={{ fontSize:11, color:"#4ade80", fontWeight:700, letterSpacing:2, textTransform:"uppercase", marginBottom:8 }}>Scrambly · Unified Analytics</div>
          <h1 style={{ fontSize:28, fontWeight:800, margin:0, color:"#f1f5f9" }}>Ad Performance Dashboard</h1>
          <p style={{ color:"#64748b", marginTop:8, fontSize:14, marginBottom:0 }}>Jan 1 – Mar 25, 2026 · All Adapty campaigns</p>
        </div>

        {/* Top-level tabs */}
        <div style={{ display:"flex", gap:4, marginBottom:28, background:"#141b2d", padding:4, borderRadius:12, width:"fit-content", border:"1px solid #1e2a3a" }}>
          {TOP_PAGES.map(p => (
            <button key={p.id} onClick={() => setTopPage(p.id)} style={{
              padding:"8px 22px", borderRadius:9, border:"none", cursor:"pointer",
              fontSize:13, fontWeight:700, transition:"all 0.15s",
              background: topPage===p.id ? "#1e2d45" : "transparent",
              color: topPage===p.id ? p.accent : "#4b5e75",
              boxShadow: topPage===p.id ? `0 0 0 1px ${p.accent}33` : "none",
            }}>
              {p.label}
            </button>
          ))}
        </div>

        {/* Overview page */}
        {topPage === "overview" && <OverviewPage />}

        {/* Campaigns page */}
        {topPage === "campaigns" && <CampaignsPage />}

        {/* Daily charts page */}
        {topPage === "daily" && (
          <>
            <div style={{ display:"flex", gap:4, marginBottom:20, background:"#141b2d", padding:4, borderRadius:10, width:"fit-content", border:"1px solid #1e2a3a" }}>
              {PAGES.map(p => (
                <button key={p.id} onClick={() => setDailyPage(p.id)} style={{
                  padding:"6px 18px", borderRadius:7, border:"none", cursor:"pointer",
                  fontSize:12, fontWeight:700, transition:"all 0.15s",
                  background: dailyPage===p.id ? "#1e2d45" : "transparent",
                  color: dailyPage===p.id ? p.accent : "#4b5e75",
                  boxShadow: dailyPage===p.id ? `0 0 0 1px ${p.accent}33` : "none",
                }}>
                  {p.label}
                </button>
              ))}
            </div>
            <div style={{ marginBottom:20, fontSize:13, color:"#4b5e75" }}>
              <span style={{ color:currentDailyPage.accent, fontWeight:700 }}>{currentDailyPage.label}</span>
              {" — "}{currentDailyPage.desc} · each line = one campaign generation · Feb 12 – Mar 25
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(480px, 1fr))", gap:20 }}>
              {groups.map(([groupName, { geo, campaigns }]) => (
                <GroupCard key={groupName} groupName={groupName} geo={geo} campaigns={campaigns} page={dailyPage}/>
              ))}
            </div>
            <div style={{ marginTop:28, color:"#2d3f55", fontSize:11, textAlign:"center" }}>
              {dailyPage==="ir"  && "Install Rate = Installs ÷ Clicks · Dashed line = group average · Tooltip shows installs / clicks"}
              {dailyPage==="cpi" && "eCPI = Effective Cost Per Install · Dashed line = group average · Lower is better"}
              {dailyPage==="roi" && "Ad ROI 1d = 1-day return on ad spend · Dashed line = group average · Higher is better"}
            </div>
          </>
        )}

      </div>
    </div>
  );
}
