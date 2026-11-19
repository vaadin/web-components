const FIRST_NAMES = ['Aino', 'Eino', 'Helmi', 'Juho', 'Kaarina', 'Lauri', 'Mikko', 'Noora', 'Oskari', 'Siiri'];
const LAST_NAMES = ['Korhonen', 'Virtanen', 'Mäkinen', 'Nieminen', 'Hämäläinen', 'Laine', 'Heikkinen', 'Koskinen'];
const PROFESSIONS = ['Designer', 'Developer', 'Manager', 'Tester', 'Writer'];

/** 80 people with stable values, so stories and screenshots do not change between runs */
export const people = LAST_NAMES.flatMap((lastName, i) =>
  FIRST_NAMES.map((firstName, j) => ({
    id: i * FIRST_NAMES.length + j,
    firstName,
    lastName,
    email: `${firstName}.${lastName}@example.com`.toLowerCase(),
    profession: PROFESSIONS[(i + j) % PROFESSIONS.length],
  })),
);

export const countries = [
  'Argentina',
  'Australia',
  'Brazil',
  'Canada',
  'Denmark',
  'Estonia',
  'Finland',
  'France',
  'Germany',
  'Iceland',
  'Japan',
  'Norway',
  'Portugal',
  'Spain',
  'Sweden',
  'Ukraine',
  'United Kingdom',
  'United States',
];
