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
  },
  {
    name: {
      title: 'mr',
      first: 'maël',
      last: 'carpentier'
    },
    location: {
      street: "5208 place de l'abbé-franz-stock",
      city: 'boulogne-billancourt',
      state: 'creuse',
      zip: 74380
    },
    email: 'maël.carpentier@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'sacha',
      last: 'boyer'
    },
    location: {
      street: '9137 rue de la mairie',
      city: 'orléans',
      state: 'val-de-marne',
      zip: 37223
    },
    email: 'sacha.boyer@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'ewen',
      last: 'bernard'
    },
    location: {
      street: "6235 rue du bât-d'argent",
      city: 'versailles',
      state: 'aude',
      zip: 94999
    },
    email: 'ewen.bernard@example.com'
  },
  {
    name: {
      title: 'ms',
      first: 'justine',
      last: 'lacroix'
    },
    location: {
      street: '7209 rue de bonnel',
      city: 'saint-étienne',
      state: 'pyrénées-orientales',
      zip: 16872
    },
    email: 'justine.lacroix@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'mathys',
      last: 'brun'
    },
    location: {
      street: '8114 rue abel-gance',
      city: 'marseille',
      state: 'nord',
      zip: 75632
    },
    email: 'mathys.brun@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'nathanaël',
      last: 'renard'
    },
    location: {
      street: "4972 rue de l'abbé-patureau",
      city: 'roubaix',
      state: 'vosges',
      zip: 80974
    },
    email: 'nathanaël.renard@example.com'
  },
  {
    name: {
      title: 'miss',
      first: 'enora',
      last: 'morel'
    },
    location: {
      street: "1649 place de l'abbé-georges-hénocque",
      city: 'saint-pierre',
      state: 'doubs',
      zip: 70462
    },
    email: 'enora.morel@example.com'
  },
  {
    name: {
      title: 'miss',
      first: 'alexia',
      last: 'roger'
    },
    location: {
      street: "7970 rue de l'abbé-patureau",
      city: 'amiens',
      state: 'gers',
      zip: 79238
    },
    email: 'alexia.roger@example.com'
  },
  {
    name: {
      title: 'mrs',
      first: 'elise',
      last: 'moreau'
    },
    location: {
      street: '7295 rue du cardinal-gerlier',
      city: 'reims',
      state: 'corrèze',
      zip: 24436
    },
    email: 'elise.moreau@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'lucien',
      last: 'richard'
    },
    location: {
      street: '1774 avenue des ternes',
      city: 'aix-en-provence',
      state: 'gard',
      zip: 14228
    },
    email: 'lucien.richard@example.com'
  },
  {
    name: {
      title: 'miss',
      first: 'maélie',
      last: 'vidal'
    },
    location: {
      street: "1967 place de l'abbé-georges-hénocque",
      city: 'caen',
      state: 'ardennes',
      zip: 50930
    },
    email: 'maélie.vidal@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'soren',
      last: 'mercier'
    },
    location: {
      street: '1226 avenue joliot curie',
      city: 'lyon',
      state: 'alpes-maritimes',
      zip: 47279
    },
    email: 'soren.mercier@example.com'
  },
  {
    name: {
      title: 'mrs',
      first: 'lina',
      last: 'vincent'
    },
    location: {
      street: "5448 rue de l'abbé-roger-derry",
      city: 'angers',
      state: 'eure-et-loir',
      zip: 43857
    },
    email: 'lina.vincent@example.com'
  },
  {
    name: {
      title: 'ms',
      first: 'inès',
      last: 'garcia'
    },
    location: {
      street: '3738 rue baraban',
      city: 'tours',
      state: 'seine-et-marne',
      zip: 23659
    },
    email: 'inès.garcia@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'jean',
      last: 'rousseau'
    },
    location: {
      street: '4052 rue des jardins',
      city: 'rennes',
      state: 'puy-de-dôme',
      zip: 59683
    },
    email: 'jean.rousseau@example.com'
  },
  {
    name: {
      title: 'ms',
      first: 'laly',
      last: 'blanc'
    },
    location: {
      street: "1832 rue de l'église",
      city: 'angers',
      state: 'tarn-et-garonne',
      zip: 12774
    },
    email: 'laly.blanc@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'owen',
      last: 'joly'
    },
    location: {
      street: '2569 rue de la mairie',
      city: 'caen',
      state: 'morbihan',
      zip: 45294
    },
    email: 'owen.joly@example.com'
  },
  {
    name: {
      title: 'mrs',
      first: 'lia',
      last: 'thomas'
    },
    location: {
      street: '5012 rue de la baleine',
      city: 'rueil-malmaison',
      state: 'haute-savoie',
      zip: 79519
    },
    email: 'lia.thomas@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'ilan',
      last: 'charles'
    },
    location: {
      street: '5950 avenue vauban',
      city: 'asnières-sur-seine',
      state: 'paris',
      zip: 64409
    },
    email: 'ilan.charles@example.com'
  },
  {
    name: {
      title: 'miss',
      first: 'garance',
      last: 'fabre'
    },
    location: {
      street: '1290 avenue des ternes',
      city: 'reims',
      state: 'essonne 91',
      zip: 62116
    },
    email: 'garance.fabre@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'matthieu',
      last: 'pierre'
    },
    location: {
      street: '8601 rue de la charité',
      city: 'vitry-sur-seine',
      state: 'ille-et-vilaine',
      zip: 30454
    },
    email: 'matthieu.pierre@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'lino',
      last: 'guerin'
    },
    location: {
      street: '6341 rue chazière',
      city: 'rueil-malmaison',
      state: 'seine-maritime',
      zip: 13660
    },
    email: 'lino.guerin@example.com'
  },
  {
    name: {
      title: 'ms',
      first: 'cassandra',
      last: 'perrin'
    },
    location: {
      street: '1321 rue de cuire',
      city: 'rennes',
      state: 'alpes-de-haute-provence',
      zip: 67814
    },
    email: 'cassandra.perrin@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'diego',
      last: 'lefebvre'
    },
    location: {
      street: '8728 place du 8 novembre 1942',
      city: 'dijon',
      state: 'gers',
      zip: 48414
    },
    email: 'diego.lefebvre@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'pablo',
      last: 'dufour'
    },
    location: {
      street: '6560 rue abel-ferry',
      city: 'le havre',
      state: 'var',
      zip: 60702
    },
    email: 'pablo.dufour@example.com'
  },
  {
    name: {
      title: 'ms',
      first: 'claire',
      last: 'deschamps'
    },
    location: {
      street: "3039 rue de l'abbé-rousselot",
      city: 'paris',
      state: 'vosges',
      zip: 49382
    },
    email: 'claire.deschamps@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'dorian',
      last: 'renaud'
    },
    location: {
      street: "5224 rue de l'abbé-migne",
      city: 'le mans',
      state: 'creuse',
      zip: 12516
    },
    email: 'dorian.renaud@example.com'
  },
  {
    name: {
      title: 'miss',
      first: 'lina',
      last: 'pierre'
    },
    location: {
      street: '8779 rue bossuet',
      city: 'aubervilliers',
      state: 'seine-et-marne',
      zip: 12725
    },
    email: 'lina.pierre@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'loïs',
      last: 'le gall'
    },
    location: {
      street: '6686 rue abel-gance',
      city: 'fort-de-france',
      state: 'vaucluse',
      zip: 88377
    },
    email: 'loïs.legall@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'lorenzo',
      last: 'vidal'
    },
    location: {
      street: '4349 avenue joliot curie',
      city: 'angers',
      state: 'tarn-et-garonne',
      zip: 59060
    },
    email: 'lorenzo.vidal@example.com'
  },
  {
    name: {
      title: 'ms',
      first: 'elsa',
      last: 'durand'
    },
    location: {
      street: '8687 rue bony',
      city: 'saint-pierre',
      state: 'charente-maritime',
      zip: 25807
    },
    email: 'elsa.durand@example.com'
  },
  {
    name: {
      title: 'miss',
      first: 'maelya',
      last: 'rodriguez'
    },
    location: {
      street: '8861 rue dumenge',
      city: 'nice',
      state: 'seine-saint-denis',
      zip: 36453
    },
    email: 'maelya.rodriguez@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'nicolas',
      last: 'bernard'
    },
    location: {
      street: '4245 quai charles-de-gaulle',
      city: 'créteil',
      state: 'tarn-et-garonne',
      zip: 98910
    },
    email: 'nicolas.bernard@example.com'
  },
  {
    name: {
      title: 'miss',
      first: 'louisa',
      last: 'menard'
    },
    location: {
      street: '7641 rue du moulin',
      city: 'saint-denis',
      state: 'haute-corse',
      zip: 17526
    },
    email: 'louisa.menard@example.com'
  },
  {
    name: {
      title: 'miss',
      first: 'diane',
      last: 'chevalier'
    },
    location: {
      street: '5456 rue baraban',
      city: 'roubaix',
      state: 'territoire de belfort',
      zip: 44542
    },
    email: 'diane.chevalier@example.com'
  },
  {
    name: {
      title: 'ms',
      first: 'flavie',
      last: 'marie'
    },
    location: {
      street: "5467 rue du bât-d'argent",
      city: 'bordeaux',
      state: 'haut-rhin',
      zip: 44442
    },
    email: 'flavie.marie@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'amaury',
      last: 'robin'
    },
    location: {
      street: '6967 rue barrier',
      city: 'aulnay-sous-bois',
      state: 'guyane',
      zip: 10997
    },
    email: 'amaury.robin@example.com'
  },
  {
    name: {
      title: 'mrs',
      first: 'eléa',
      last: 'fournier'
    },
    location: {
      street: "3386 place de l'abbé-jean-lebeuf",
      city: 'tourcoing',
      state: 'pyrénées-orientales',
      zip: 70280
    },
    email: 'eléa.fournier@example.com'
  },
  {
    name: {
      title: 'ms',
      first: 'eléonore',
      last: 'boyer'
    },
    location: {
      street: '1369 avenue du fort-caire',
      city: 'nice',
      state: 'guadeloupe',
      zip: 12634
    },
    email: 'eléonore.boyer@example.com'
  },
  {
    name: {
      title: 'mrs',
      first: 'lila',
      last: 'nicolas'
    },
    location: {
      street: '3521 rue dugas-montbel',
      city: 'dunkerque',
      state: 'vaucluse',
      zip: 45555
    },
    email: 'lila.nicolas@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'théodore',
      last: 'charles'
    },
    location: {
      street: '1062 rue du 8 mai 1945',
      city: 'roubaix',
      state: 'corrèze',
      zip: 36297
    },
    email: 'théodore.charles@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'liam',
      last: 'legrand'
    },
    location: {
      street: '4869 rue jean-baldassini',
      city: 'grenoble',
      state: 'haute-loire',
      zip: 67383
    },
    email: 'liam.legrand@example.com'
  },
  {
    name: {
      title: 'ms',
      first: 'séléna',
      last: 'lucas'
    },
    location: {
      street: '6677 rue du moulin',
      city: 'villeurbanne',
      state: 'meuse',
      zip: 76942
    },
    email: 'séléna.lucas@example.com'
  },
  {
    name: {
      title: 'miss',
      first: 'romy',
      last: 'gautier'
    },
    location: {
      street: '6680 rue des jardins',
      city: 'angers',
      state: 'la réunion',
      zip: 49929
    },
    email: 'romy.gautier@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'angelo',
      last: 'rey'
    },
    location: {
      street: '1148 rue abel-gance',
      city: 'rouen',
      state: 'eure-et-loir',
      zip: 95415
    },
    email: 'angelo.rey@example.com'
  },
  {
    name: {
      title: 'miss',
      first: 'lucie',
      last: 'gerard'
    },
    location: {
      street: '8039 rue abel',
      city: 'paris',
      state: 'allier',
      zip: 53796
    },
    email: 'lucie.gerard@example.com'
  },
  {
    name: {
      title: 'miss',
      first: 'sarah',
      last: 'lucas'
    },
    location: {
      street: '1625 rue laure-diebold',
      city: 'dunkerque',
      state: 'lot-et-garonne',
      zip: 67850
    },
    email: 'sarah.lucas@example.com'
  },
  {
    name: {
      title: 'miss',
      first: 'léane',
      last: 'vidal'
    },
    location: {
      street: '1364 montée saint-barthélémy',
      city: 'besançon',
      state: 'bouches-du-rhône',
      zip: 72646
    },
    email: 'léane.vidal@example.com'
  },
  {
    name: {
      title: 'mrs',
      first: 'valentine',
      last: 'michel'
    },
    location: {
      street: '8473 rue de bonnel',
      city: 'rueil-malmaison',
      state: 'meurthe-et-moselle',
      zip: 34105
    },
    email: 'valentine.michel@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'lyam',
      last: 'denis'
    },
    location: {
      street: '7197 place du 8 novembre 1942',
      city: 'grenoble',
      state: 'manche',
      zip: 52232
    },
    email: 'lyam.denis@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'pierre',
      last: 'morin'
    },
    location: {
      street: '3713 rue abel-gance',
      city: 'dijon',
      state: 'calvados',
      zip: 42110
    },
    email: 'pierre.morin@example.com'
  },
  {
    name: {
      title: 'mrs',
      first: 'jeanne',
      last: 'legrand'
    },
    location: {
      street: '5214 boulevard de balmont',
      city: 'saint-denis',
      state: 'gers',
      zip: 50595
    },
    email: 'jeanne.legrand@example.com'
  },
  {
    name: {
      title: 'mrs',
      first: 'eve',
      last: 'blanchard'
    },
    location: {
      street: "7933 rue de l'abbaye",
      city: 'courbevoie',
      state: 'aisn',
      zip: 64027
    },
    email: 'eve.blanchard@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'ewen',
      last: 'charles'
    },
    location: {
      street: '3058 rue docteur-bonhomme',
      city: 'paris',
      state: 'haute-corse',
      zip: 10582
    },
    email: 'ewen.charles@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'quentin',
      last: 'dumas'
    },
    location: {
      street: '9840 rue des chartreux',
      city: 'fort-de-france',
      state: 'haute-vienne',
      zip: 33208
    },
    email: 'quentin.dumas@example.com'
  },
  {
    name: {
      title: 'ms',
      first: 'lucie',
      last: 'guerin'
    },
    location: {
      street: '7513 rue louis-blanqui',
      city: 'créteil',
      state: 'haute-savoie',
      zip: 17960
    },
    email: 'lucie.guerin@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'gabriel',
      last: 'david'
    },
    location: {
      street: '1415 rue dugas-montbel',
      city: 'saint-étienne',
      state: 'pyrénées-orientales',
      zip: 11891
    },
    email: 'gabriel.david@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'mathieu',
      last: 'menard'
    },
    location: {
      street: '3909 avenue goerges clémenceau',
      city: 'créteil',
      state: 'eure-et-loir',
      zip: 20589
    },
    email: 'mathieu.menard@example.com'
  },
  {
    name: {
      title: 'ms',
      first: 'alizee',
      last: 'gauthier'
    },
    location: {
      street: '2394 rue du stade',
      city: 'argenteuil',
      state: 'lot-et-garonne',
      zip: 31319
    },
    email: 'alizee.gauthier@example.com'
  },
  {
    name: {
      title: 'miss',
      first: 'naomi',
      last: 'michel'
    },
    location: {
      street: '5119 rue de la fontaine',
      city: 'nîmes',
      state: 'haut-rhin',
      zip: 31193
    },
    email: 'naomi.michel@example.com'
  },
  {
    name: {
      title: 'ms',
      first: 'amandine',
      last: 'chevalier'
    },
    location: {
      street: '4104 rue louis-blanqui',
      city: 'saint-étienne',
      state: 'pas-de-calais',
      zip: 75392
    },
    email: 'amandine.chevalier@example.com'
  },
  {
    name: {
      title: 'mrs',
      first: 'victoria',
      last: 'vincent'
    },
    location: {
      street: '8533 rue barrier',
      city: 'roubaix',
      state: 'loir-et-cher',
      zip: 93690
    },
    email: 'victoria.vincent@example.com'
  },
  {
    name: {
      title: 'mrs',
      first: 'marilou',
      last: 'robin'
    },
    location: {
      street: '1820 rue duguesclin',
      city: 'villeurbanne',
      state: 'essonne 91',
      zip: 82090
    },
    email: 'marilou.robin@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'simon',
      last: 'girard'
    },
    location: {
      street: '8065 rue barrème',
      city: 'orléans',
      state: 'jura',
      zip: 45630
    },
    email: 'simon.girard@example.com'
  },
  {
    name: {
      title: 'ms',
      first: 'sara',
      last: 'leclerc'
    },
    location: {
      street: '6553 rue dubois',
      city: 'toulon',
      state: 'puy-de-dôme',
      zip: 66877
    },
    email: 'sara.leclerc@example.com'
  },
  {
    name: {
      title: 'miss',
      first: 'manon',
      last: 'dufour'
    },
    location: {
      street: '2092 avenue du fort-caire',
      city: 'toulon',
      state: 'drôme',
      zip: 19136
    },
    email: 'manon.dufour@example.com'
  },
  {
    name: {
      title: 'ms',
      first: 'lucie',
      last: 'perrin'
    },
    location: {
      street: '5968 quai chauveau',
      city: 'grenoble',
      state: 'maine-et-loire',
      zip: 25591
    },
    email: 'lucie.perrin@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'célestin',
      last: 'caron'
    },
    location: {
      street: '5583 place du 8 février 1962',
      city: 'pau',
      state: 'guadeloupe',
      zip: 89780
    },
    email: 'célestin.caron@example.com'
  },
  {
    name: {
      title: 'mrs',
      first: 'nora',
      last: 'sanchez'
    },
    location: {
      street: '4503 rue courbet',
      city: 'mulhouse',
      state: 'oise',
      zip: 12383
    },
    email: 'nora.sanchez@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'victor',
      last: 'lacroix'
    },
    location: {
      street: '2902 rue laure-diebold',
      city: 'nantes',
      state: 'loire',
      zip: 85289
    },
    email: 'victor.lacroix@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'cléo',
      last: 'gonzalez'
    },
    location: {
      street: '2714 rue courbet',
      city: 'colombes',
      state: 'vendée',
      zip: 68910
    },
    email: 'cléo.gonzalez@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'justin',
      last: 'henry'
    },
    location: {
      street: "8141 rue d'abbeville",
      city: 'courbevoie',
      state: 'manche',
      zip: 86746
    },
    email: 'justin.henry@example.com'
  },
  {
    name: {
      title: 'ms',
      first: 'eloïse',
      last: 'francois'
    },
    location: {
      street: "5215 place de l'abbé-jean-lebeuf",
      city: 'tours',
      state: 'vendée',
      zip: 34489
    },
    email: 'eloïse.francois@example.com'
  },
  {
    name: {
      title: 'ms',
      first: 'valentine',
      last: 'rey'
    },
    location: {
      street: '2688 boulevard de la duchère',
      city: 'nantes',
      state: 'nord',
      zip: 59203
    },
    email: 'valentine.rey@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'léonard',
      last: 'denis'
    },
    location: {
      street: '5828 rue des cuirassiers',
      city: 'tours',
      state: 'isère',
      zip: 12773
    },
    email: 'léonard.denis@example.com'
  },
  {
    name: {
      title: 'mrs',
      first: 'sophie',
      last: 'adam'
    },
    location: {
      street: '9048 rue du moulin',
      city: 'nîmes',
      state: 'aude',
      zip: 72453
    },
    email: 'sophie.adam@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'thibaut',
      last: 'lucas'
    },
    location: {
      street: '1557 rue chazière',
      city: 'dijon',
      state: 'allier',
      zip: 74638
    },
    email: 'thibaut.lucas@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'johan',
      last: 'renaud'
    },
    location: {
      street: "2660 rue de l'abbé-gillet",
      city: 'asnières-sur-seine',
      state: 'pas-de-calais',
      zip: 97075
    },
    email: 'johan.renaud@example.com'
  },
  {
    name: {
      title: 'miss',
      first: 'jade',
      last: 'garnier'
    },
    location: {
      street: "8967 place des 44 enfants d'izieu",
      city: 'paris',
      state: 'manche',
      zip: 90666
    },
    email: 'jade.garnier@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'timeo',
      last: 'petit'
    },
    location: {
      street: '7239 rue abel',
      city: 'villeurbanne',
      state: 'saône-et-loire',
      zip: 74447
    },
    email: 'timeo.petit@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'julien',
      last: 'leroy'
    },
    location: {
      street: "2257 avenue de l'abbé-roussel",
      city: 'nanterre',
      state: 'drôme',
      zip: 87242
    },
    email: 'julien.leroy@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'gaëtan',
      last: 'nicolas'
    },
    location: {
      street: '4373 rue du château',
      city: 'nanterre',
      state: 'aisn',
      zip: 15512
    },
    email: 'gaëtan.nicolas@example.com'
  },
  {
    name: {
      title: 'mrs',
      first: 'emmy',
      last: 'fontai'
    },
    location: {
      street: '1332 rue de la fontaine',
      city: 'saint-denis',
      state: 'tarn-et-garonne',
      zip: 18215
    },
    email: 'emmy.fontai@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'ilan',
      last: 'roy'
    },
    location: {
      street: '6494 grande rue',
      city: 'pau',
      state: 'sarthe',
      zip: 73754
    },
    email: 'ilan.roy@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'dorian',
      last: 'marchand'
    },
    location: {
      street: '6838 rue bataille',
      city: 'le mans',
      state: 'indre',
      zip: 85215
    },
    email: 'dorian.marchand@example.com'
  },
  {
    name: {
      title: 'miss',
      first: 'constance',
      last: 'roussel'
    },
    location: {
      street: '4162 rue saint-georges',
      city: 'metz',
      state: 'savoie',
      zip: 47612
    },
    email: 'constance.roussel@example.com'
  },
  {
    name: {
      title: 'miss',
      first: 'sara',
      last: 'andre'
    },
    location: {
      street: "3032 rue du bât-d'argent",
      city: 'dijon',
      state: 'haut-rhin',
      zip: 95086
    },
    email: 'sara.andre@example.com'
  },
  {
    name: {
      title: 'mrs',
      first: 'apolline',
      last: 'moulin'
    },
    location: {
      street: '8882 place de la mairie',
      city: 'aubervilliers',
      state: 'eure',
      zip: 73503
    },
    email: 'apolline.moulin@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'johan',
      last: 'vincent'
    },
    location: {
      street: '1015 rue des abbesses',
      city: 'villeurbanne',
      state: 'nièvre',
      zip: 82429
    },
    email: 'johan.vincent@example.com'
  },
  {
    name: {
      title: 'miss',
      first: 'mélody',
      last: 'vidal'
    },
    location: {
      street: '9185 rue de la baleine',
      city: 'bordeaux',
      state: 'vendée',
      zip: 70247
    },
    email: 'mélody.vidal@example.com'
  },
  {
    name: {
      title: 'miss',
      first: 'lya',
      last: 'david'
    },
    location: {
      street: '3984 rue barrème',
      city: 'courbevoie',
      state: 'dordogne',
      zip: 66403
    },
    email: 'lya.david@example.com'
  },
  {
    name: {
      title: 'miss',
      first: 'bérénice',
      last: 'gauthier'
    },
    location: {
      street: '3896 place paul-duquaire',
      city: 'saint-étienne',
      state: 'nord',
      zip: 31408
    },
    email: 'bérénice.gauthier@example.com'
  },
  {
    name: {
      title: 'miss',
      first: 'olivia',
      last: 'boyer'
    },
    location: {
      street: '8282 rue principale',
      city: 'strasbourg',
      state: 'vosges',
      zip: 46355
    },
    email: 'olivia.boyer@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'robin',
      last: 'lemaire'
    },
    location: {
      street: "4305 rue de l'église",
      city: 'pau',
      state: 'ardèche',
      zip: 46881
    },
    email: 'robin.lemaire@example.com'
  },
  {
    name: {
      title: 'miss',
      first: 'constance',
      last: 'moulin'
    },
    location: {
      street: "4269 rue de l'abbé-roger-derry",
      city: 'colombes',
      state: 'seine-saint-denis',
      zip: 98323
    },
    email: 'constance.moulin@example.com'
  },
  {
    name: {
      title: 'ms',
      first: 'margaux',
      last: 'guerin'
    },
    location: {
      street: '4153 rue cyrus-hugues',
      city: 'le mans',
      state: 'charente-maritime',
      zip: 30722
    },
    email: 'margaux.guerin@example.com'
  },
  {
    name: {
      title: 'mrs',
      first: 'lila',
      last: 'chevalier'
    },
    location: {
      street: '9572 rue baraban',
      city: 'versailles',
      state: 'alpes-maritimes',
      zip: 91582
    },
    email: 'lila.chevalier@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'guillaume',
      last: 'lacroix'
    },
    location: {
      street: '6381 rue des chartreux',
      city: 'paris',
      state: 'lozère',
      zip: 65560
    },
    email: 'guillaume.lacroix@example.com'
  },
  {
    name: {
      title: 'ms',
      first: 'romy',
      last: 'nguyen'
    },
    location: {
      street: '7837 cours charlemagne',
      city: 'courbevoie',
      state: 'haute-garonne',
      zip: 29689
    },
    email: 'romy.nguyen@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'justin',
      last: 'leroy'
    },
    location: {
      street: "4990 rue d'abbeville",
      city: 'nantes',
      state: 'haut-rhin',
      zip: 90173
    },
    email: 'justin.leroy@example.com'
  },
  {
    name: {
      title: 'mrs',
      first: 'kelya',
      last: 'rey'
    },
    location: {
      street: '3826 rue du bon-pasteur',
      city: 'bordeaux',
      state: 'jura',
      zip: 18967
    },
    email: 'kelya.rey@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'edouard',
      last: 'muller'
    },
    location: {
      street: '1512 rue denfert-rochereau',
      city: 'rennes',
      state: 'puy-de-dôme',
      zip: 86538
    },
    email: 'edouard.muller@example.com'
  },
  {
    name: {
      title: 'mrs',
      first: 'louisa',
      last: 'joly'
    },
    location: {
      street: "8915 rue de l'abbé-carton",
      city: 'nanterre',
      state: 'moselle',
      zip: 68719
    },
    email: 'louisa.joly@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'mathieu',
      last: 'arnaud'
    },
    location: {
      street: '3087 rue cyrus-hugues',
      city: 'reims',
      state: 'vendée',
      zip: 72631
    },
    email: 'mathieu.arnaud@example.com'
  },
  {
    name: {
      title: 'mrs',
      first: 'léonie',
      last: 'garnier'
    },
    location: {
      street: '2535 rue pierre-delore',
      city: 'reims',
      state: 'corse-du-sud',
      zip: 10326
    },
    email: 'léonie.garnier@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'roméo',
      last: 'durand'
    },
    location: {
      street: '8385 rue pasteur',
      city: 'villeurbanne',
      state: 'eure',
      zip: 64641
    },
    email: 'roméo.durand@example.com'
  },
  {
    name: {
      title: 'mrs',
      first: 'lilou',
      last: 'robert'
    },
    location: {
      street: '8943 rue abel-gance',
      city: 'asnières-sur-seine',
      state: 'tarn',
      zip: 14597
    },
    email: 'lilou.robert@example.com'
  },
  {
    name: {
      title: 'miss',
      first: 'clarisse',
      last: 'lemaire'
    },
    location: {
      street: "7080 rue de l'abbé-carton",
      city: 'avignon',
      state: 'val-de-marne',
      zip: 61205
    },
    email: 'clarisse.lemaire@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'théo',
      last: 'lemoine'
    },
    location: {
      street: '1497 rue duguesclin',
      city: 'saint-étienne',
      state: 'alpes-maritimes',
      zip: 84487
    },
    email: 'théo.lemoine@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'tim',
      last: 'fernandez'
    },
    location: {
      street: '5205 rue de la fontaine',
      city: 'strasbourg',
      state: 'eure',
      zip: 52350
    },
    email: 'tim.fernandez@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'pablo',
      last: 'renard'
    },
    location: {
      street: "2203 rue de l'abbé-roger-derry",
      city: 'reims',
      state: 'martinique',
      zip: 68901
    },
    email: 'pablo.renard@example.com'
  },
  {
    name: {
      title: 'mrs',
      first: 'mélody',
      last: 'lambert'
    },
    location: {
      street: '5234 rue abel-ferry',
      city: 'saint-pierre',
      state: 'somme',
      zip: 92087
    },
    email: 'mélody.lambert@example.com'
  },
  {
    name: {
      title: 'ms',
      first: 'giulia',
      last: 'meyer'
    },
    location: {
      street: '7412 rue paul-duvivier',
      city: 'aubervilliers',
      state: 'gers',
      zip: 31316
    },
    email: 'giulia.meyer@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'maxence',
      last: 'leroux'
    },
    location: {
      street: '5555 rue du dauphiné',
      city: 'brest',
      state: 'haute-savoie',
      zip: 61388
    },
    email: 'maxence.leroux@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'téo',
      last: 'guerin'
    },
    location: {
      street: '2287 place du 8 novembre 1942',
      city: 'rennes',
      state: 'yvelines',
      zip: 27607
    },
    email: 'téo.guerin@example.com'
  },
  {
    name: {
      title: 'miss',
      first: 'luna',
      last: 'roussel'
    },
    location: {
      street: '4953 rue du moulin',
      city: 'angers',
      state: 'aveyron',
      zip: 72211
    },
    email: 'luna.roussel@example.com'
  },
  {
    name: {
      title: 'ms',
      first: 'maëline',
      last: 'roy'
    },
    location: {
      street: '3388 rue de bonnel',
      city: 'montreuil',
      state: 'allier',
      zip: 33778
    },
    email: 'maëline.roy@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'jordan',
      last: 'roger'
    },
    location: {
      street: '2291 rue des abbesses',
      city: 'marseille',
      state: 'indre-et-loire',
      zip: 22525
    },
    email: 'jordan.roger@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'rafael',
      last: 'muller'
    },
    location: {
      street: "5824 rue de l'abbé-soulange-bodin",
      city: 'metz',
      state: 'pas-de-calais',
      zip: 31642
    },
    email: 'rafael.muller@example.com'
  },
  {
    name: {
      title: 'ms',
      first: 'charlotte',
      last: 'fleury'
    },
    location: {
      street: '9861 avenue de la libération',
      city: 'poitiers',
      state: 'drôme',
      zip: 58632
    },
    email: 'charlotte.fleury@example.com'
  },
  {
    name: {
      title: 'ms',
      first: 'eva',
      last: 'robin'
    },
    location: {
      street: '1332 cours charlemagne',
      city: 'marseille',
      state: 'allier',
      zip: 80575
    },
    email: 'eva.robin@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'martin',
      last: 'menard'
    },
    location: {
      street: '7293 avenue debrousse',
      city: 'grenoble',
      state: 'vosges',
      zip: 41264
    },
    email: 'martin.menard@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'ruben',
      last: 'dubois'
    },
    location: {
      street: "5141 rue du bât-d'argent",
      city: 'aubervilliers',
      state: 'haute-marne',
      zip: 90648
    },
    email: 'ruben.dubois@example.com'
  },
  {
    name: {
      title: 'ms',
      first: 'lia',
      last: 'olivier'
    },
    location: {
      street: '6078 rue courbet',
      city: 'asnières-sur-seine',
      state: 'ardèche',
      zip: 50179
    },
    email: 'lia.olivier@example.com'
  },
  {
    name: {
      title: 'ms',
      first: 'maelya',
      last: 'brunet'
    },
    location: {
      street: '4864 rue de la mairie',
      city: 'dunkerque',
      state: 'yonne',
      zip: 58768
    },
    email: 'maelya.brunet@example.com'
  },
  {
    name: {
      title: 'ms',
      first: 'estelle',
      last: 'francois'
    },
    location: {
      street: '9297 place du 8 février 1962',
      city: 'nice',
      state: 'dordogne',
      zip: 95842
    },
    email: 'estelle.francois@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'sacha',
      last: 'rey'
    },
    location: {
      street: '1392 avenue jean-jaurès',
      city: 'rueil-malmaison',
      state: 'tarn',
      zip: 52777
    },
    email: 'sacha.rey@example.com'
  },
  {
    name: {
      title: 'miss',
      first: 'inaya',
      last: 'brunet'
    },
    location: {
      street: '1751 rue bossuet',
      city: 'angers',
      state: 'allier',
      zip: 17391
    },
    email: 'inaya.brunet@example.com'
  },
  {
    name: {
      title: 'mrs',
      first: 'roxane',
      last: 'lefebvre'
    },
    location: {
      street: "9416 place de l'abbé-jean-lebeuf",
      city: 'toulon',
      state: 'haute-savoie',
      zip: 39227
    },
    email: 'roxane.lefebvre@example.com'
  },
  {
    name: {
      title: 'ms',
      first: 'chiara',
      last: 'riviere'
    },
    location: {
      street: '4338 rue pasteur',
      city: 'montpellier',
      state: 'loir-et-cher',
      zip: 66528
    },
    email: 'chiara.riviere@example.com'
  },
  {
    name: {
      title: 'mrs',
      first: 'alexia',
      last: 'rousseau'
    },
    location: {
      street: '7107 rue dumenge',
      city: 'courbevoie',
      state: 'aube',
      zip: 93400
    },
    email: 'alexia.rousseau@example.com'
  },
  {
    name: {
      title: 'miss',
      first: 'méline',
      last: 'masson'
    },
    location: {
      street: '2192 rue duquesne',
      city: 'courbevoie',
      state: 'vienne',
      zip: 20784
    },
    email: 'méline.masson@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'loïc',
      last: 'blanc'
    },
    location: {
      street: '3790 quai chauveau',
      city: 'pau',
      state: 'pas-de-calais',
      zip: 89631
    },
    email: 'loïc.blanc@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'elio',
      last: 'francois'
    },
    location: {
      street: '7136 rue de la mairie',
      city: 'dunkerque',
      state: 'sarthe',
      zip: 20086
    },
    email: 'elio.francois@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'anatole',
      last: 'caron'
    },
    location: {
      street: "5588 place de l'église",
      city: 'montreuil',
      state: 'bas-rhin',
      zip: 32576
    },
    email: 'anatole.caron@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'tristan',
      last: 'lemoine'
    },
    location: {
      street: '3725 avenue debrousse',
      city: 'mulhouse',
      state: 'vosges',
      zip: 79564
    },
    email: 'tristan.lemoine@example.com'
  },
  {
    name: {
      title: 'miss',
      first: 'julia',
      last: 'leclercq'
    },
    location: {
      street: '8098 avenue de la libération',
      city: 'caen',
      state: 'pyrénées-orientales',
      zip: 39744
    },
    email: 'julia.leclercq@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'kylian',
      last: 'hubert'
    },
    location: {
      street: '6831 rue cyrus-hugues',
      city: 'orléans',
      state: 'essonne 91',
      zip: 49128
    },
    email: 'kylian.hubert@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'joshua',
      last: 'deschamps'
    },
    location: {
      street: '2719 rue gasparin',
      city: 'colombes',
      state: 'yonne',
      zip: 44316
    },
    email: 'joshua.deschamps@example.com'
  },
  {
    name: {
      title: 'miss',
      first: 'roxane',
      last: 'philippe'
    },
    location: {
      street: '9445 rue laure-diebold',
      city: 'metz',
      state: 'drôme',
      zip: 27138
    },
    email: 'roxane.philippe@example.com'
  },
  {
    name: {
      title: 'miss',
      first: 'celestine',
      last: 'henry'
    },
    location: {
      street: "1362 rue du bât-d'argent",
      city: 'tourcoing',
      state: 'landes',
      zip: 28343
    },
    email: 'celestine.henry@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'corentin',
      last: 'dupuis'
    },
    location: {
      street: '3704 avenue vauban',
      city: 'le havre',
      state: 'somme',
      zip: 70779
    },
    email: 'corentin.dupuis@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'joris',
      last: 'schmitt'
    },
    location: {
      street: '9780 rue barrier',
      city: 'dijon',
      state: 'ardèche',
      zip: 85776
    },
    email: 'joris.schmitt@example.com'
  },
  {
    name: {
      title: 'ms',
      first: 'capucine',
      last: 'martin'
    },
    location: {
      street: '9591 rue pierre-delore',
      city: 'argenteuil',
      state: 'pas-de-calais',
      zip: 95317
    },
    email: 'capucine.martin@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'nils',
      last: 'philippe'
    },
    location: {
      street: "6031 rue de l'église",
      city: 'limoges',
      state: 'maine-et-loire',
      zip: 26014
    },
    email: 'nils.philippe@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'timeo',
      last: 'riviere'
    },
    location: {
      street: '1170 rue du 8 mai 1945',
      city: 'rennes',
      state: 'nord',
      zip: 86360
    },
    email: 'timeo.riviere@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'louka',
      last: 'roussel'
    },
    location: {
      street: '3962 rue de la fontaine',
      city: 'toulon',
      state: 'haut-rhin',
      zip: 46214
    },
    email: 'louka.roussel@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'charles',
      last: 'robin'
    },
    location: {
      street: '7905 avenue goerges clémenceau',
      city: 'montreuil',
      state: 'seine-maritime',
      zip: 86663
    },
    email: 'charles.robin@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'charles',
      last: 'pierre'
    },
    location: {
      street: '9824 rue paul bert',
      city: 'nanterre',
      state: 'pas-de-calais',
      zip: 23709
    },
    email: 'charles.pierre@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'roméo',
      last: 'dubois'
    },
    location: {
      street: '8652 rue de la mairie',
      city: 'villeurbanne',
      state: 'haute-saône',
      zip: 21701
    },
    email: 'roméo.dubois@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'timothe',
      last: 'morin'
    },
    location: {
      street: '2004 avenue des ternes',
      city: 'boulogne-billancourt',
      state: 'haute-corse',
      zip: 68710
    },
    email: 'timothe.morin@example.com'
  },
  {
    name: {
      title: 'miss',
      first: 'elsa',
      last: 'carpentier'
    },
    location: {
      street: '1843 rue victor-hugo',
      city: 'perpignan',
      state: 'eure-et-loir',
      zip: 76340
    },
    email: 'elsa.carpentier@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'damien',
      last: 'bernard'
    },
    location: {
      street: '6358 rue louis-garrand',
      city: 'aubervilliers',
      state: 'gard',
      zip: 63831
    },
    email: 'damien.bernard@example.com'
  },
  {
    name: {
      title: 'ms',
      first: 'celestine',
      last: 'bernard'
    },
    location: {
      street: '3508 rue paul-duvivier',
      city: 'toulon',
      state: 'doubs',
      zip: 89698
    },
    email: 'celestine.bernard@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'nolan',
      last: 'roche'
    },
    location: {
      street: "6247 place de l'église",
      city: 'mulhouse',
      state: 'lot-et-garonne',
      zip: 27556
    },
    email: 'nolan.roche@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'louka',
      last: 'moulin'
    },
    location: {
      street: '1155 rue jean-baldassini',
      city: 'saint-étienne',
      state: 'marne',
      zip: 82990
    },
    email: 'louka.moulin@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'evan',
      last: 'faure'
    },
    location: {
      street: '5490 rue barrier',
      city: 'fort-de-france',
      state: 'marne',
      zip: 46709
    },
    email: 'evan.faure@example.com'
  },
  {
    name: {
      title: 'miss',
      first: 'ninon',
      last: 'duval'
    },
    location: {
      street: "2516 place de l'abbé-basset",
      city: 'caen',
      state: 'var',
      zip: 18684
    },
    email: 'ninon.duval@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'oscar',
      last: 'gautier'
    },
    location: {
      street: '7428 rue barrier',
      city: 'dijon',
      state: 'maine-et-loire',
      zip: 79657
    },
    email: 'oscar.gautier@example.com'
  },
  {
    name: {
      title: 'ms',
      first: 'océane',
      last: 'david'
    },
    location: {
      street: '7033 rue du stade',
      city: 'dunkerque',
      state: 'loir-et-cher',
      zip: 34843
    },
    email: 'océane.david@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'titouan',
      last: 'louis'
    },
    location: {
      street: '5699 rue de gerland',
      city: 'colombes',
      state: 'gers',
      zip: 36161
    },
    email: 'titouan.louis@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'alexis',
      last: 'fournier'
    },
    location: {
      street: '2842 rue dumenge',
      city: 'lille',
      state: 'deux-sèvres',
      zip: 66712
    },
    email: 'alexis.fournier@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'gaspard',
      last: 'petit'
    },
    location: {
      street: "8099 place de l'église",
      city: 'avignon',
      state: 'charente-maritime',
      zip: 11748
    },
    email: 'gaspard.petit@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'oscar',
      last: 'sanchez'
    },
    location: {
      street: '5630 rue cyrus-hugues',
      city: 'rouen',
      state: 'dordogne',
      zip: 22346
    },
    email: 'oscar.sanchez@example.com'
  },
  {
    name: {
      title: 'ms',
      first: 'tess',
      last: 'lambert'
    },
    location: {
      street: '3893 rue gasparin',
      city: 'bordeaux',
      state: 'jura',
      zip: 58401
    },
    email: 'tess.lambert@example.com'
  },
  {
    name: {
      title: 'miss',
      first: 'axelle',
      last: 'caron'
    },
    location: {
      street: '8504 avenue de la libération',
      city: 'montpellier',
      state: 'pyrénées-orientales',
      zip: 87934
    },
    email: 'axelle.caron@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'kaïs',
      last: 'bonnet'
    },
    location: {
      street: '4437 rue abel-gance',
      city: 'versailles',
      state: 'nord',
      zip: 45194
    },
    email: 'kaïs.bonnet@example.com'
  },
  {
    name: {
      title: 'miss',
      first: 'lucy',
      last: 'rousseau'
    },
    location: {
      street: '2046 rue de bonnel',
      city: 'toulon',
      state: 'seine-et-marne',
      zip: 14557
    },
    email: 'lucy.rousseau@example.com'
  },
  {
    name: {
      title: 'miss',
      first: 'sophia',
      last: 'picard'
    },
    location: {
      street: "3117 place de l'abbé-georges-hénocque",
      city: 'lille',
      state: 'lot-et-garonne',
      zip: 27764
    },
    email: 'sophia.picard@example.com'
  },
  {
    name: {
      title: 'mrs',
      first: 'eloïse',
      last: 'lecomte'
    },
    location: {
      street: "1629 place des 44 enfants d'izieu",
      city: 'mulhouse',
      state: 'nord',
      zip: 55040
    },
    email: 'eloïse.lecomte@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'thomas',
      last: 'garcia'
    },
    location: {
      street: '4428 rue bataille',
      city: 'reims',
      state: 'bouches-du-rhône',
      zip: 86375
    },
    email: 'thomas.garcia@example.com'
  },
  {
    name: {
      title: 'miss',
      first: 'lilou',
      last: 'vincent'
    },
    location: {
      street: "2393 rue de l'abbé-de-l'épée",
      city: 'rouen',
      state: 'orne',
      zip: 57857
    },
    email: 'lilou.vincent@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'oscar',
      last: 'colin'
    },
    location: {
      street: '6077 rue pasteur',
      city: 'vitry-sur-seine',
      state: 'loiret',
      zip: 63317
    },
    email: 'oscar.colin@example.com'
  },
  {
    name: {
      title: 'mrs',
      first: 'amandine',
      last: 'chevalier'
    },
    location: {
      street: "9489 rue de l'abbé-soulange-bodin",
      city: 'reims',
      state: 'yvelines',
      zip: 52280
    },
    email: 'amandine.chevalier@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'luca',
      last: 'roche'
    },
    location: {
      street: '3415 rue cyrus-hugues',
      city: 'avignon',
      state: 'finistère',
      zip: 24501
    },
    email: 'luca.roche@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'livio',
      last: 'gautier'
    },
    location: {
      street: '5621 place du 22 novembre 1943',
      city: 'aix-en-provence',
      state: 'manche',
      zip: 94922
    },
    email: 'livio.gautier@example.com'
  },
  {
    name: {
      title: 'miss',
      first: 'héloïse',
      last: 'gerard'
    },
    location: {
      street: '8035 avenue vauban',
      city: 'le havre',
      state: 'sarthe',
      zip: 42418
    },
    email: 'héloïse.gerard@example.com'
  },
  {
    name: {
      title: 'mrs',
      first: 'hélèna',
      last: 'sanchez'
    },
    location: {
      street: '6182 rue de la barre',
      city: 'colombes',
      state: 'meurthe-et-moselle',
      zip: 51274
    },
    email: 'hélèna.sanchez@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'joshua',
      last: 'clement'
    },
    location: {
      street: "6389 rue de l'abbaye",
      city: 'fort-de-france',
      state: 'pas-de-calais',
      zip: 29469
    },
    email: 'joshua.clement@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'théo',
      last: 'le gall'
    },
    location: {
      street: '5047 rue barrier',
      city: 'pau',
      state: 'seine-maritime',
      zip: 81736
    },
    email: 'théo.legall@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'amaury',
      last: 'marie'
    },
    location: {
      street: "2496 rue du bât-d'argent",
      city: 'poitiers',
      state: 'doubs',
      zip: 55239
    },
    email: 'amaury.marie@example.com'
  },
  {
    name: {
      title: 'ms',
      first: 'mia',
      last: 'perez'
    },
    location: {
      street: '6647 rue abel-gance',
      city: 'mulhouse',
      state: 'pas-de-calais',
      zip: 63980
    },
    email: 'mia.perez@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'julian',
      last: 'garnier'
    },
    location: {
      street: '9121 rue cyrus-hugues',
      city: 'strasbourg',
      state: 'aube',
      zip: 68224
    },
    email: 'julian.garnier@example.com'
  },
  {
    name: {
      title: 'ms',
      first: 'louisa',
      last: 'garcia'
    },
    location: {
      street: '8955 rue duguesclin',
      city: 'brest',
      state: 'territoire de belfort',
      zip: 19714
    },
    email: 'louisa.garcia@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'alban',
      last: 'roussel'
    },
    location: {
      street: '3280 rue dumenge',
      city: 'perpignan',
      state: 'vosges',
      zip: 76104
    },
    email: 'alban.roussel@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'thibaut',
      last: 'petit'
    },
    location: {
      street: '4454 rue paul bert',
      city: 'saint-étienne',
      state: 'pyrénées-atlantiques',
      zip: 81332
    },
    email: 'thibaut.petit@example.com'
  },
  {
    name: {
      title: 'miss',
      first: 'sara',
      last: 'rodriguez'
    },
    location: {
      street: "3371 place de l'abbé-georges-hénocque",
      city: 'amiens',
      state: 'seine-maritime',
      zip: 36396
    },
    email: 'sara.rodriguez@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'fabien',
      last: 'olivier'
    },
    location: {
      street: '7724 rue du bon-pasteur',
      city: 'rennes',
      state: 'aube',
      zip: 38139
    },
    email: 'fabien.olivier@example.com'
  },
  {
    name: {
      title: 'mr',
      first: 'robin',
      last: 'robin'
    },
    location: {
      street: '5070 rue abel',
      city: 'toulouse',
      state: 'territoire de belfort',
      zip: 12479
    },
    email: 'robin.robin@example.com'
  },
  {
    name: {
      title: 'ms',
      first: 'emeline',
      last: 'lefebvre'
    },
    location: {
      street: '7030 rue de la mairie',
      city: 'caen',
      state: 'territoire de belfort',
      zip: 87664
    },
    email: 'emeline.lefebvre@example.com'
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
