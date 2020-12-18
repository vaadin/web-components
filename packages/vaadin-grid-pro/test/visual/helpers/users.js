const data = [
  {
    name: {
      title: 'ms',
      first: 'laura',
      last: 'arnaud'
    },
    location: {
      street: '5372 avenue du château',
      city: 'perpignan',
      state: 'jura',
      zip: 93076
    },
    email: 'laura.arnaud@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'fabien',
      last: 'le gall'
    },
    location: {
      street: '9932 rue bossuet',
      city: 'nanterre',
      state: 'indre',
      zip: 86307
    },
    email: 'fabien.legall@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'ruben',
      last: 'leclercq'
    },
    location: {
      street: "6698 rue de l'abbaye",
      city: 'clermont-ferrand',
      state: 'marne',
      zip: 80183
    },
    email: 'ruben.leclercq@example.com'
  },
  {
    name: {
      title: 'ms',
      first: 'kelya',
      last: 'roy'
    },
    location: {
      street: '4011 rue duquesne',
      city: 'avignon',
      state: 'ardennes',
      zip: 84488
    },
    email: 'kelya.roy@example.com'
  },
  {
    name: {
      title: 'mrs',
      first: 'roxane',
      last: 'guillaume'
    },
    location: {
      street: '4420 rue de la barre',
      city: 'marseille',
      state: 'vaucluse',
      zip: 25339
    },
    email: 'roxane.guillaume@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'marius',
      last: 'moulin'
    },
    location: {
      street: '7220 rue barrier',
      city: 'mulhouse',
      state: 'haute-savoie',
      zip: 90132
    },
    email: 'marius.moulin@example.com'
  },
  {
    name: {
      title: 'mrs',
      first: 'nina',
      last: 'barbier'
    },
    location: {
      street: '8823 rue principale',
      city: 'versailles',
      state: 'territoire de belfort',
      zip: 41960
    },
    email: 'nina.barbier@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'marceau',
      last: 'lucas'
    },
    location: {
      street: '8601 avenue joliot curie',
      city: 'strasbourg',
      state: 'aveyron',
      zip: 31008
    },
    email: 'marceau.lucas@example.com'
  },
  {
    name: {
      title: 'mrs',
      first: 'lise',
      last: 'barbier'
    },
    location: {
      street: '8266 montée saint-barthélémy',
      city: 'nancy',
      state: 'haute-corse',
      zip: 36269
    },
    email: 'lise.barbier@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'louka',
      last: 'girard'
    },
    location: {
      street: '1546 rue paul-duvivier',
      city: 'amiens',
      state: 'loiret',
      zip: 21273
    },
    email: 'louka.girard@example.com'
  }
];

function capitalize(lower) {
  return lower.charAt(0).toUpperCase() + lower.substr(1);
}

const users = data.map((item) => {
  const user = Object.assign({}, item);
  user.name.first = capitalize(user.name.first);
  user.name.last = capitalize(user.name.last);
  user.location.city = capitalize(user.location.city);
  user.location.state = capitalize(user.location.state);
  return user;
});

export { users };
