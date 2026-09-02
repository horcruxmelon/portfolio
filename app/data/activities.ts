export type Activity = {
  title: string;
  description: string;
  image: string;
  gradient: string;
};

export const activities: Activity[] = [
  {
    title: "Cubbon Classic 10K",
    description:
      "Finished the Cubbon Classic 10K in 48:36, with a 5K personal best of 22:55.",
    image: "/activities/cubbon-classic.jpg",
    gradient: "from-orange-700 to-orange-950",
  },
  {
    title: "Team KGF Lake Run",
    description:
      "Early-morning training runs with the team — building up mileage one lake loop at a time.",
    image: "/activities/lake-run.png",
    gradient: "from-emerald-700 to-emerald-950",
  },
  {
    title: "Company Quarter Master Sergeant",
    description:
      "National Cadet Corps, Sep 2023 – Feb 2026. Led a cadet unit of 120 members, building leadership, discipline, and teamwork through structured training and drills.",
    image: "/activities/ncc-parade.jpg",
    gradient: "from-amber-800 to-amber-950",
  },
  {
    title: "3 Karnataka Battalion NCC",
    description:
      "Manipal Academy of Higher Education's NCC unit — camps, ceremonial parades, and drills with the battalion.",
    image: "/activities/ncc-group.jpg",
    gradient: "from-rose-800 to-rose-950",
  },
];
