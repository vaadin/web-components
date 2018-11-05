

// monkey-patch window.fetch so as when requested 'users.json' we return
// the in-memory array of users window.users
// This also fixes IE11 that does not have the window.fetch method.
if (!window._fetch) {
  window._fetch = window.fetch || true;
  window.fetch = function(input, init) {
    if (input == 'users.json') { // return mock data from memory `window.users`
      return new Promise(function(resolve, reject) {
        resolve({
          json: function() {
            return new Promise(function(resolve, reject) {
              setTimeout(function() { // Emulate async
                resolve(window.users);
              }, 800);
            });
          }
        });
      });
    } else if (typeof window._fetch !== 'function') { // IE11
      var xhr = new XMLHttpRequest();
      const promise = new Promise(function(resolve, reject) {
        xhr.onload = function() {
          resolve({
            json: function() {
              return new Promise(function(resolve, reject) {
                resolve(JSON.parse(xhr.responseText));
              });
            }
          });
        };
      });
      xhr.open('GET', input, true);
      xhr.send();
      return promise;
    } else {
      return window._fetch(input, init);
    }
  }
}

// An array of users in memory
window.users =
[
  {
    "_id": "5953f755ad720c45621bf48e",
    "name": {
      "first": "Grant",
      "last": "Andrews"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/44.jpg",
      "email": "grantandrews@exosis.com"
    },
    "password": "0Abc9154",
    "role": "operator"
  },
  {
    "_id": "5953f7551415ee5f718ad0a5",
    "name": {
      "first": "Rogers",
      "last": "Cook"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/10.jpg",
      "email": "rogerscook@exosis.com"
    },
    "password": "0Abc1391",
    "role": "admin"
  },
  {
    "_id": "5953f755e7987c8532f92842",
    "name": {
      "first": "Wells",
      "last": "Faulkner"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/48.jpg",
      "email": "wellsfaulkner@exosis.com"
    },
    "password": "0Abc5653",
    "role": "operator"
  },
  {
    "_id": "5953f7554638ec9a223354b1",
    "name": {
      "first": "Fischer",
      "last": "Welch"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/67.jpg",
      "email": "fischerwelch@exosis.com"
    },
    "password": "0Abc2457",
    "role": "admin"
  },
  {
    "_id": "5953f7555da9c2651194e580",
    "name": {
      "first": "Barber",
      "last": "Stevens"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/16.jpg",
      "email": "barberstevens@exosis.com"
    },
    "password": "0Abc4427",
    "role": "operator"
  },
  {
    "_id": "5953f755988758e93ed40e7e",
    "name": {
      "first": "Lacy",
      "last": "Lloyd"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/42.jpg",
      "email": "lacylloyd@exosis.com"
    },
    "password": "0Abc5045",
    "role": "user"
  },
  {
    "_id": "5953f755639209cd8c718441",
    "name": {
      "first": "Delaney",
      "last": "Carrillo"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/54.jpg",
      "email": "delaneycarrillo@exosis.com"
    },
    "password": "0Abc2963",
    "role": "admin"
  },
  {
    "_id": "5953f7555b37b9a286ea84f8",
    "name": {
      "first": "Hurst",
      "last": "Mcdonald"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/99.jpg",
      "email": "hurstmcdonald@exosis.com"
    },
    "password": "0Abc6522",
    "role": "admin"
  },
  {
    "_id": "5953f755443e389251d0d3f9",
    "name": {
      "first": "Crawford",
      "last": "Zimmerman"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/37.jpg",
      "email": "crawfordzimmerman@exosis.com"
    },
    "password": "0Abc7514",
    "role": "operator"
  },
  {
    "_id": "5953f7557631d234eef6987c",
    "name": {
      "first": "Rachael",
      "last": "Alvarado"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/71.jpg",
      "email": "rachaelalvarado@exosis.com"
    },
    "password": "0Abc3941",
    "role": "admin"
  },
  {
    "_id": "5953f755131d25fd83f6b21b",
    "name": {
      "first": "Glenn",
      "last": "Norris"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/51.jpg",
      "email": "glennnorris@exosis.com"
    },
    "password": "0Abc2958",
    "role": "admin"
  },
  {
    "_id": "5953f755df606902f9e2c890",
    "name": {
      "first": "Davis",
      "last": "Leach"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/95.jpg",
      "email": "davisleach@exosis.com"
    },
    "password": "0Abc9773",
    "role": "user"
  },
  {
    "_id": "5953f7556b7364aef52d7aec",
    "name": {
      "first": "Curry",
      "last": "Fox"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/56.jpg",
      "email": "curryfox@exosis.com"
    },
    "password": "0Abc9229",
    "role": "user"
  },
  {
    "_id": "5953f755bd24638a091ba539",
    "name": {
      "first": "Wilkinson",
      "last": "Tran"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/43.jpg",
      "email": "wilkinsontran@exosis.com"
    },
    "password": "0Abc8186",
    "role": "admin"
  },
  {
    "_id": "5953f75518757174bfc33f78",
    "name": {
      "first": "Sharlene",
      "last": "Miranda"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/79.jpg",
      "email": "sharlenemiranda@exosis.com"
    },
    "password": "0Abc3040",
    "role": "operator"
  },
  {
    "_id": "5953f755b8573106eb99866d",
    "name": {
      "first": "Marquita",
      "last": "Brady"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/13.jpg",
      "email": "marquitabrady@exosis.com"
    },
    "password": "0Abc4768",
    "role": "admin"
  },
  {
    "_id": "5953f75525a3f4f61f3e19eb",
    "name": {
      "first": "Julianne",
      "last": "Rich"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/33.jpg",
      "email": "juliannerich@exosis.com"
    },
    "password": "0Abc4542",
    "role": "user"
  },
  {
    "_id": "5953f7553c8fcc74ff39edc9",
    "name": {
      "first": "Monroe",
      "last": "Horton"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/8.jpg",
      "email": "monroehorton@exosis.com"
    },
    "password": "0Abc2956",
    "role": "admin"
  },
  {
    "_id": "5953f75595fa1199db616417",
    "name": {
      "first": "Heather",
      "last": "Doyle"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/91.jpg",
      "email": "heatherdoyle@exosis.com"
    },
    "password": "0Abc9556",
    "role": "operator"
  },
  {
    "_id": "5953f7555492a48fc988a957",
    "name": {
      "first": "Christine",
      "last": "Carter"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/36.jpg",
      "email": "christinecarter@exosis.com"
    },
    "password": "0Abc1374",
    "role": "user"
  },
  {
    "_id": "5953f75535d6ace4f4e58490",
    "name": {
      "first": "Elba",
      "last": "Jarvis"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/90.jpg",
      "email": "elbajarvis@exosis.com"
    },
    "password": "0Abc5844",
    "role": "admin"
  },
  {
    "_id": "5953f755a88060f48165d2dd",
    "name": {
      "first": "Bonner",
      "last": "Stein"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/79.jpg",
      "email": "bonnerstein@exosis.com"
    },
    "password": "0Abc2224",
    "role": "operator"
  },
  {
    "_id": "5953f755c974baf39b8d9db8",
    "name": {
      "first": "Hicks",
      "last": "Taylor"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/17.jpg",
      "email": "hickstaylor@exosis.com"
    },
    "password": "0Abc8746",
    "role": "admin"
  },
  {
    "_id": "5953f755c1e3643b1f9f90cc",
    "name": {
      "first": "Riddle",
      "last": "Mayer"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/24.jpg",
      "email": "riddlemayer@exosis.com"
    },
    "password": "0Abc6216",
    "role": "user"
  },
  {
    "_id": "5953f755bb75639c5b2f033c",
    "name": {
      "first": "Lou",
      "last": "Albert"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/3.jpg",
      "email": "loualbert@exosis.com"
    },
    "password": "0Abc2965",
    "role": "user"
  },
  {
    "_id": "5953f7550f17d019b09b383e",
    "name": {
      "first": "Celia",
      "last": "Gould"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/1.jpg",
      "email": "celiagould@exosis.com"
    },
    "password": "0Abc7737",
    "role": "admin"
  },
  {
    "_id": "5953f755fede5ec8f5faa0c3",
    "name": {
      "first": "Bernice",
      "last": "Lowery"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/1.jpg",
      "email": "bernicelowery@exosis.com"
    },
    "password": "0Abc8140",
    "role": "user"
  },
  {
    "_id": "5953f755669cf5227fd5f7b7",
    "name": {
      "first": "Hardin",
      "last": "Arnold"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/39.jpg",
      "email": "hardinarnold@exosis.com"
    },
    "password": "0Abc7501",
    "role": "admin"
  },
  {
    "_id": "5953f755682d7989de396fee",
    "name": {
      "first": "Marina",
      "last": "Wheeler"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/2.jpg",
      "email": "marinawheeler@exosis.com"
    },
    "password": "0Abc9498",
    "role": "user"
  },
  {
    "_id": "5953f75511a5cb65dfd06ece",
    "name": {
      "first": "Hooper",
      "last": "Rhodes"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/11.jpg",
      "email": "hooperrhodes@exosis.com"
    },
    "password": "0Abc3642",
    "role": "operator"
  },
  {
    "_id": "5953f75588c57ed61eadca84",
    "name": {
      "first": "Jeannette",
      "last": "Hicks"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/3.jpg",
      "email": "jeannettehicks@exosis.com"
    },
    "password": "0Abc9398",
    "role": "user"
  },
  {
    "_id": "5953f7552ca59a1ff945454f",
    "name": {
      "first": "Rowland",
      "last": "Bowman"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/66.jpg",
      "email": "rowlandbowman@exosis.com"
    },
    "password": "0Abc3111",
    "role": "operator"
  },
  {
    "_id": "5953f75524066553498edad4",
    "name": {
      "first": "Gail",
      "last": "Hester"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/78.jpg",
      "email": "gailhester@exosis.com"
    },
    "password": "0Abc4943",
    "role": "admin"
  },
  {
    "_id": "5953f75544a168b02472c34f",
    "name": {
      "first": "Hobbs",
      "last": "Graham"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/3.jpg",
      "email": "hobbsgraham@exosis.com"
    },
    "password": "0Abc8118",
    "role": "operator"
  },
  {
    "_id": "5953f755bf3685ef492e8bc0",
    "name": {
      "first": "Mullins",
      "last": "Hopkins"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/66.jpg",
      "email": "mullinshopkins@exosis.com"
    },
    "password": "0Abc8113",
    "role": "operator"
  },
  {
    "_id": "5953f755b0aeb8df718e6b8a",
    "name": {
      "first": "Hayden",
      "last": "Nelson"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/19.jpg",
      "email": "haydennelson@exosis.com"
    },
    "password": "0Abc7436",
    "role": "operator"
  },
  {
    "_id": "5953f75533530a9ed878f147",
    "name": {
      "first": "Deloris",
      "last": "Hernandez"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/5.jpg",
      "email": "delorishernandez@exosis.com"
    },
    "password": "0Abc6923",
    "role": "operator"
  },
  {
    "_id": "5953f755ad9791e4a9adc59e",
    "name": {
      "first": "Jaime",
      "last": "Monroe"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/86.jpg",
      "email": "jaimemonroe@exosis.com"
    },
    "password": "0Abc5367",
    "role": "admin"
  },
  {
    "_id": "5953f7558e8e01cf275a546b",
    "name": {
      "first": "Denise",
      "last": "Howard"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/86.jpg",
      "email": "denisehoward@exosis.com"
    },
    "password": "0Abc9585",
    "role": "admin"
  },
  {
    "_id": "5953f7555ccdb9510f5f3ecc",
    "name": {
      "first": "Marion",
      "last": "Farley"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/81.jpg",
      "email": "marionfarley@exosis.com"
    },
    "password": "0Abc6862",
    "role": "user"
  },
  {
    "_id": "5953f7555a02d68609ec08dd",
    "name": {
      "first": "Finley",
      "last": "Robertson"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/29.jpg",
      "email": "finleyrobertson@exosis.com"
    },
    "password": "0Abc8097",
    "role": "admin"
  },
  {
    "_id": "5953f755a946adc8f13cb05c",
    "name": {
      "first": "Boyer",
      "last": "Blackwell"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/93.jpg",
      "email": "boyerblackwell@exosis.com"
    },
    "password": "0Abc6914",
    "role": "operator"
  },
  {
    "_id": "5953f755727c9820a93ad3d5",
    "name": {
      "first": "Alana",
      "last": "Lynn"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/30.jpg",
      "email": "alanalynn@exosis.com"
    },
    "password": "0Abc6054",
    "role": "admin"
  },
  {
    "_id": "5953f755403546a8a3d1906d",
    "name": {
      "first": "Mindy",
      "last": "Hart"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/35.jpg",
      "email": "mindyhart@exosis.com"
    },
    "password": "0Abc4400",
    "role": "admin"
  },
  {
    "_id": "5953f7554cc6ed218f70c60c",
    "name": {
      "first": "Cohen",
      "last": "Dickson"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/45.jpg",
      "email": "cohendickson@exosis.com"
    },
    "password": "0Abc7359",
    "role": "operator"
  },
  {
    "_id": "5953f75585be155d62223914",
    "name": {
      "first": "Frank",
      "last": "Salazar"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/41.jpg",
      "email": "franksalazar@exosis.com"
    },
    "password": "0Abc9950",
    "role": "admin"
  },
  {
    "_id": "5953f7556153e1ac7a5b61ca",
    "name": {
      "first": "Hatfield",
      "last": "Stafford"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/33.jpg",
      "email": "hatfieldstafford@exosis.com"
    },
    "password": "0Abc9212",
    "role": "operator"
  },
  {
    "_id": "5953f7557aaeaf298adb842f",
    "name": {
      "first": "Foley",
      "last": "Ayers"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/83.jpg",
      "email": "foleyayers@exosis.com"
    },
    "password": "0Abc9270",
    "role": "operator"
  },
  {
    "_id": "5953f755ae6c647114921e48",
    "name": {
      "first": "Maryellen",
      "last": "Kinney"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/60.jpg",
      "email": "maryellenkinney@exosis.com"
    },
    "password": "0Abc5658",
    "role": "admin"
  },
  {
    "_id": "5953f7553adde0c0481948b8",
    "name": {
      "first": "Shields",
      "last": "Hyde"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/13.jpg",
      "email": "shieldshyde@exosis.com"
    },
    "password": "0Abc5302",
    "role": "operator"
  },
  {
    "_id": "5953f755fd0d7f7245d6dedc",
    "name": {
      "first": "Bridgette",
      "last": "Paul"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/24.jpg",
      "email": "bridgettepaul@exosis.com"
    },
    "password": "0Abc7649",
    "role": "operator"
  },
  {
    "_id": "5953f755636d529591098506",
    "name": {
      "first": "Faye",
      "last": "Woods"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/75.jpg",
      "email": "fayewoods@exosis.com"
    },
    "password": "0Abc6698",
    "role": "admin"
  },
  {
    "_id": "5953f7556b4fdd6afd7ebfeb",
    "name": {
      "first": "Silva",
      "last": "Cooke"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/11.jpg",
      "email": "silvacooke@exosis.com"
    },
    "password": "0Abc7905",
    "role": "admin"
  },
  {
    "_id": "5953f7550dba3cc3ed5b7f23",
    "name": {
      "first": "Tanisha",
      "last": "Watson"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/68.jpg",
      "email": "tanishawatson@exosis.com"
    },
    "password": "0Abc8352",
    "role": "admin"
  },
  {
    "_id": "5953f755084ae23a09ba3d9f",
    "name": {
      "first": "Rollins",
      "last": "Reid"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/53.jpg",
      "email": "rollinsreid@exosis.com"
    },
    "password": "0Abc8151",
    "role": "operator"
  },
  {
    "_id": "5953f755a5dda872da74f546",
    "name": {
      "first": "Dunlap",
      "last": "Adkins"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/7.jpg",
      "email": "dunlapadkins@exosis.com"
    },
    "password": "0Abc7513",
    "role": "user"
  },
  {
    "_id": "5953f7555d50558e01a7114d",
    "name": {
      "first": "Carson",
      "last": "Atkinson"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/55.jpg",
      "email": "carsonatkinson@exosis.com"
    },
    "password": "0Abc6318",
    "role": "operator"
  },
  {
    "_id": "5953f7557f9dd406b766bd28",
    "name": {
      "first": "Francisca",
      "last": "Garza"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/49.jpg",
      "email": "franciscagarza@exosis.com"
    },
    "password": "0Abc6130",
    "role": "user"
  },
  {
    "_id": "5953f75583cfe30fe7adc90e",
    "name": {
      "first": "Tammie",
      "last": "Galloway"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/85.jpg",
      "email": "tammiegalloway@exosis.com"
    },
    "password": "0Abc2429",
    "role": "user"
  },
  {
    "_id": "5953f75515bbf4d221f616f8",
    "name": {
      "first": "Georgia",
      "last": "Mcguire"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/32.jpg",
      "email": "georgiamcguire@exosis.com"
    },
    "password": "0Abc4426",
    "role": "user"
  },
  {
    "_id": "5953f7551267a33a81493985",
    "name": {
      "first": "Livingston",
      "last": "Maynard"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/82.jpg",
      "email": "livingstonmaynard@exosis.com"
    },
    "password": "0Abc9928",
    "role": "operator"
  },
  {
    "_id": "5953f75533b53c309b24c32e",
    "name": {
      "first": "Gutierrez",
      "last": "Wooten"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/93.jpg",
      "email": "gutierrezwooten@exosis.com"
    },
    "password": "0Abc8416",
    "role": "admin"
  },
  {
    "_id": "5953f75516643bc4f3f4aff5",
    "name": {
      "first": "Ramirez",
      "last": "Hines"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/13.jpg",
      "email": "ramirezhines@exosis.com"
    },
    "password": "0Abc7595",
    "role": "operator"
  },
  {
    "_id": "5953f7559bfda3892cd8ab53",
    "name": {
      "first": "Rhodes",
      "last": "Hardin"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/74.jpg",
      "email": "rhodeshardin@exosis.com"
    },
    "password": "0Abc7642",
    "role": "user"
  },
  {
    "_id": "5953f755548880f1f4a4517e",
    "name": {
      "first": "Earline",
      "last": "Morse"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/88.jpg",
      "email": "earlinemorse@exosis.com"
    },
    "password": "0Abc1128",
    "role": "operator"
  },
  {
    "_id": "5953f755fe0aca5beef3bf79",
    "name": {
      "first": "Waller",
      "last": "Bright"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/33.jpg",
      "email": "wallerbright@exosis.com"
    },
    "password": "0Abc7817",
    "role": "operator"
  },
  {
    "_id": "5953f7553249bcbeb7a6d928",
    "name": {
      "first": "Deidre",
      "last": "Salas"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/20.jpg",
      "email": "deidresalas@exosis.com"
    },
    "password": "0Abc7805",
    "role": "operator"
  },
  {
    "_id": "5953f75593def2c70b717f4a",
    "name": {
      "first": "Steele",
      "last": "Head"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/4.jpg",
      "email": "steelehead@exosis.com"
    },
    "password": "0Abc1302",
    "role": "operator"
  },
  {
    "_id": "5953f755fe7dbaedd8afde4a",
    "name": {
      "first": "Garner",
      "last": "Ferguson"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/37.jpg",
      "email": "garnerferguson@exosis.com"
    },
    "password": "0Abc1870",
    "role": "admin"
  },
  {
    "_id": "5953f7558d14395bc8b7e7b0",
    "name": {
      "first": "Wagner",
      "last": "Dudley"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/52.jpg",
      "email": "wagnerdudley@exosis.com"
    },
    "password": "0Abc9536",
    "role": "admin"
  },
  {
    "_id": "5953f755304f31fbd05c2a50",
    "name": {
      "first": "Latisha",
      "last": "Church"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/22.jpg",
      "email": "latishachurch@exosis.com"
    },
    "password": "0Abc8205",
    "role": "admin"
  },
  {
    "_id": "5953f75501b935160c3e12e4",
    "name": {
      "first": "Rhoda",
      "last": "Jones"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/64.jpg",
      "email": "rhodajones@exosis.com"
    },
    "password": "0Abc8118",
    "role": "user"
  },
  {
    "_id": "5953f75551df274b4a55bd23",
    "name": {
      "first": "Fry",
      "last": "Washington"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/82.jpg",
      "email": "frywashington@exosis.com"
    },
    "password": "0Abc2888",
    "role": "admin"
  },
  {
    "_id": "5953f7554c983c82489b4385",
    "name": {
      "first": "Rita",
      "last": "Pearson"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/88.jpg",
      "email": "ritapearson@exosis.com"
    },
    "password": "0Abc6171",
    "role": "admin"
  },
  {
    "_id": "5953f755b4cd9acf853c4a02",
    "name": {
      "first": "Alicia",
      "last": "Chaney"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/3.jpg",
      "email": "aliciachaney@exosis.com"
    },
    "password": "0Abc7356",
    "role": "user"
  },
  {
    "_id": "5953f755146ba0f900c8153f",
    "name": {
      "first": "Leah",
      "last": "Mercer"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/70.jpg",
      "email": "leahmercer@exosis.com"
    },
    "password": "0Abc2786",
    "role": "admin"
  },
  {
    "_id": "5953f7554188de2bef626603",
    "name": {
      "first": "Jenna",
      "last": "Bird"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/12.jpg",
      "email": "jennabird@exosis.com"
    },
    "password": "0Abc7368",
    "role": "user"
  },
  {
    "_id": "5953f7556cb9e31238f9582f",
    "name": {
      "first": "Knowles",
      "last": "Durham"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/10.jpg",
      "email": "knowlesdurham@exosis.com"
    },
    "password": "0Abc6367",
    "role": "admin"
  },
  {
    "_id": "5953f75557460d7b597cb712",
    "name": {
      "first": "Randolph",
      "last": "Roberson"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/79.jpg",
      "email": "randolphroberson@exosis.com"
    },
    "password": "0Abc7820",
    "role": "user"
  },
  {
    "_id": "5953f75545967d6c50216361",
    "name": {
      "first": "Gill",
      "last": "Frederick"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/13.jpg",
      "email": "gillfrederick@exosis.com"
    },
    "password": "0Abc2897",
    "role": "user"
  },
  {
    "_id": "5953f755ce327850020d8019",
    "name": {
      "first": "Alisha",
      "last": "Mueller"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/7.jpg",
      "email": "alishamueller@exosis.com"
    },
    "password": "0Abc1007",
    "role": "user"
  },
  {
    "_id": "5953f755bfefa3168f5ddaff",
    "name": {
      "first": "Bruce",
      "last": "King"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/1.jpg",
      "email": "bruceking@exosis.com"
    },
    "password": "0Abc1753",
    "role": "admin"
  },
  {
    "_id": "5953f755c1337fa21919be2e",
    "name": {
      "first": "Bell",
      "last": "Mccarthy"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/80.jpg",
      "email": "bellmccarthy@exosis.com"
    },
    "password": "0Abc1215",
    "role": "user"
  },
  {
    "_id": "5953f75526c31d657710f9eb",
    "name": {
      "first": "Hewitt",
      "last": "Hodges"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/45.jpg",
      "email": "hewitthodges@exosis.com"
    },
    "password": "0Abc9801",
    "role": "admin"
  },
  {
    "_id": "5953f7555e8afcd77b5a8b1d",
    "name": {
      "first": "Christensen",
      "last": "Gentry"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/94.jpg",
      "email": "christensengentry@exosis.com"
    },
    "password": "0Abc4578",
    "role": "admin"
  },
  {
    "_id": "5953f755302e402d0cb265c1",
    "name": {
      "first": "Edith",
      "last": "Mccray"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/3.jpg",
      "email": "edithmccray@exosis.com"
    },
    "password": "0Abc9229",
    "role": "user"
  },
  {
    "_id": "5953f75513c166b3908deea7",
    "name": {
      "first": "Deirdre",
      "last": "Riddle"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/1.jpg",
      "email": "deirdreriddle@exosis.com"
    },
    "password": "0Abc9497",
    "role": "operator"
  },
  {
    "_id": "5953f755207e802afb3ab2ca",
    "name": {
      "first": "Irene",
      "last": "Woodward"
    },
    "details": {
      "picture": "https://randomuser.me/api/portraits/thumb/women/29.jpg",
      "email": "irenewoodward@exosis.com"
    },
    "password": "0Abc3554",
    "role": "user"
  }
];
