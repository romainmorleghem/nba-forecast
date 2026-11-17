/* Site data. To publish a new forecast: add an entry to SNAPSHOTS and set done: true in PLANNED. */

const SNAPSHOTS = [
  { date: "2026-11-15", label: "November 15, 2026", played: 197,
    // [team, conference, title %, 10th pct, 90th pct, finals %, strength]
    teams: [["Boston Celtics","E",23.3,1.3,50.1,45.2,"+8.3 ± 2.6"],["San Antonio Spurs","W",17.8,0.8,42.8,28.0,"+8.6 ± 2.5"],
      ["Houston Rockets","W",14.9,0.2,46.6,23.0,"+7.8 ± 2.5"],["Denver Nuggets","W",6.0,0.0,22.0,11.2,"+4.7 ± 2.6"],
      ["Los Angeles Lakers","W",5.7,0.0,14.4,10.9,"+5.3 ± 2.5"],["Oklahoma City Thunder","W",5.5,0.0,12.1,9.7,"+5.6 ± 2.5"],
      ["Cleveland Cavaliers","E",4.7,0.0,14.0,13.6,"+4.1 ± 2.5"],["Portland Trail Blazers","W",4.7,0.0,12.5,8.2,"+4.8 ± 2.6"],
      ["New York Knicks","E",4.1,0.0,11.4,10.9,"+3.4 ± 2.6"],["Minnesota Timberwolves","W",3.6,0.0,7.5,6.8,"+4.1 ± 2.6"],
      ["Detroit Pistons","E",3.0,0.0,9.1,9.4,"+2.8 ± 2.6"],["Philadelphia 76ers","E",2.4,0.0,6.8,6.7,"+2.1 ± 2.5"]] },
];

const PLANNED = [
  { label: "November 15, 2026", what: "About a dozen games per team. Error bars still wide.", done: true },
  { label: "Mid-December 2026", what: "About 25 games per team.", done: false },
  { label: "February 1, 2027", what: "Mid-season: the date tested on the last eleven champions.", done: false },
];

// season, champion, probability on Feb 1 (%), rank, model favorite, favorite's probability (%)
const CHAMPS = [
  ["2015-16","Cleveland",9.0,3,"Golden State",38],["2016-17","Golden State",67.7,1,"Golden State",68],
  ["2017-18","Golden State",36.6,1,"Golden State",37],["2018-19","Toronto",3.9,7,"Golden State",33],
  ["2019-20","LA Lakers",11.7,2,"Milwaukee",27],["2020-21","Milwaukee",13.1,2,"LA Lakers",23],
  ["2021-22","Golden State",16.1,1,"Golden State",16],["2022-23","Denver",11.7,2,"Boston",26],
  ["2023-24","Boston",31.0,1,"Boston",31],["2024-25","Oklahoma City",27.3,1,"Oklahoma City",27],
  ["2025-26","New York",7.5,3,"Oklahoma City",45]];

// game-to-game noise (standard deviation, points), learned each season on the 3 previous ones
const SIGMA = [[2012,11.4],[2013,11.5],[2014,11.5],[2015,11.7],[2016,11.7],[2017,11.7],[2018,12.0],[2019,12.1],
  [2020,12.6],[2021,12.6],[2022,13.1],[2023,13.5],[2024,13.5],[2025,13.5],[2026,13.5],[2027,14.0]];
