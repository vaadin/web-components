/**
 * @license
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './version.js';
import { css } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { addLumoGlobalStyles } from './global.js';

const fontIcons = css`
  @font-face {
    font-family: 'lumo-icons';
    src: url(data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAABGYAAsAAAAAI0QAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABHU1VCAAABCAAAADsAAABUIIslek9TLzIAAAFEAAAAQwAAAFZAIUuNY21hcAAAAYgAAAD+AAADymne8hxnbHlmAAACiAAAC74AABhMSMEYomhlYWQAAA5IAAAAMAAAADZa/6SsaGhlYQAADngAAAAdAAAAJAbpA4BobXR4AAAOmAAAABAAAAC0q+AAAGxvY2EAAA6oAAAAXAAAAFyFZIy8bWF4cAAADwQAAAAfAAAAIAFMAXBuYW1lAAAPJAAAATEAAAIuUUJZCHBvc3QAABBYAAABPQAAAgfdkltveJxjYGRgYOBiMGCwY2BycfMJYeDLSSzJY5BiYGGAAJA8MpsxJzM9kYEDxgPKsYBpDiBmg4gCACY7BUgAeJxjYGS+xDiBgZWBgamKaQ8DA0MPhGZ8wGDIyAQUZWBlZsAKAtJcUxgcXjG+0mEO+p/FEMUcxDANKMwIkgMABvgMMAB4nO3SV26EMABF0UsZpjG9d6Y3FpgF5StLYxMTP16WEUvHV1gGIQzQAJKgDFKIfojQ+A6rUb2e0KnXU77qPanWq/LzCXOkOVyn9RyHvWl4YkaTFu1wX5ecHn0GDBkxZsKUGXMWLFmxZsOWHXsOFBw5cebClRt3Hjx58dZ7RRn/I9cUF39Xpb691acRG2piOtUqNZ1P1TCdeJUZatNQW4baNtSO6U+ouoaam96u6hlq31AHhjo01JGhjg11YqhTQ50Z6txQF4a6NNSVoa4NdWOoW0PdGereUA+GWhjq0VBPhno21IuhXg31Zqh3Q30Y6tNQX4b6NtTSKH8BOIRpQQAAeJy1WHtsW9UZP9+J7evr+7BvfO+1ncR2/M6jcVY/m6R1mjhA+kjaqqFQYG0KDI2XyugQYlOnqV27jpUOMbF/QAM0qd1Ep7JWm4CqY4iON9PGJKBTNSGmbuIhtEGnTRXx9p1zrx07pC8hEuu75/nd73znO9/vdy5xEPxrG6ePEJmESJrkCfEXSvlYztRdiVg8HWiuaM2VTHPlkOmj0z7T9M0d9ZkbNRmelTVNrl3J5Hx5Y/Moep+q6526flThj9oBq/qG6vd3+f3MrIvZZpzXtuJ5bfPJcJybc4Xsay5fjmVfhs8OaswYNAmN0ZrLBy/PZ8BtC8Fp4sNKWgUzCmZuFCqQBS9Ap5oKUfWsElfOqTSUUk/DazLtSirvStIZJdlF5dfqOujt9IdMR8pUIT0I6QLTEUEddLNMO1Pyu7J8Rk514oz9atLSKaPOIOps2EFPWDogXeF26F5Q0Y5RgB8t0EFH1VSwoSSU5ErstVAnt8OVhdIolHJRtEKFwUXW8naT0i6qvDpvx1t0JQmgjnIpAi4vuOKDaEYFooC7kzMN2rFTihpUPi6FPcdlakSlnWa3+fpdHhqISgc9noNSNEA9d8G01zS9dZ0fWDohsNBB1gbDvdul5unSdphi2wjLFr7rO0a3uUAnRgeLlEyr38r0G7VjXMfUAt2wzOw2vmPp9YQlS29j7bdynZoKeDA0odWPGdoB+P6dC+bCP+tvWuAEptLF9+UOeph4SZQMklGyjmzFM5DPmWHQXf34nhVQKAXiLqyaI5ArYTWdYP2GZvUXNd4f0Fy8H6vpRODz/Vid7z9yhxEOG0yUBFEU+gSPRzjZ1OYB8CzSytpwOGwJG++zZhRVUTjEOg4JIjwYNuZeZe20ZITHPUJNZj1wVvDcHNFrd7EeeFCPVLHnGO+ZEpgT2rgPguiDMOkjRYythFaoQD5RZBEVhkQuAoaGbWlcjstoa8kPeaPuJdi+ZmBtFkLxEGTXDqwppmfSxcfQ7Z8x59ccPvPvO/1KRfEfAYr9fVowqPUNTA3UakDTpVK6dgojMmqa5W7Z3650o0kGt6uMdiUwL1XJRnIT2UF2kx+Tn5Fj5AXyZ/I38im0gR8SkIcqbISbMDbyaDX6Ge2295CZyfZwBOweQ1iwu9bw89e/7PHlhdF2kfrC+c7LfN/l2rOwDveek8VeUV7N9nDudSZX84aH+kRZcTOxZ5HSJ1+gd760mJjvremXqObCCukuXZRlUQ9pVpxqIV4/zld5XrHzC3WfW3TkopMuounStdu4pNN+C9viLp1hbBlKhXRcAKhIUVPaJ2ESrUpmt1Q7BV+TzCi2SDDOumrvNHDpYzhKFI5LmN9itiJqvCmontpyjyq8qfScfEloV5R24SXFnjNJN7M5iDtWXowjnulwXWMYrGDT4aQ1fR4DH6HX8nmCy0qvOQYs9MBF532M+Gu9z0oLBQYerTbCf+eNbOTGcY4PSbLUnouYm87w7Gi0xTPpTLpQLpVLuYCJnYJLcGVyFShkIa6CHgHacTXz2VYZEIjT10+tXTIwsGTt1G/qhesn75ucvO9BJuDWq5lXt0raSQbPc5+2DOSFCXsoCr6khn0ZUkDr0JhyRkAMT6AdGSGADMFAs4RAGcE3j1YGyhmETGc8C5jiMbHrKrSNbfApS0Yme+P+GX/OmBwdVHwzMz5lcGRtb9yLTaHJkSVB54bascENg4MbtjAB+9pzoVUjS0POq9dpSv/oFUbOnAnlQuN85AZNXjIy3hsP7bGHo6jvwe/pIOnklvJ9Q7cxTmB7lW1ooQwnDkiBbvmBB+TugHSgqQxbPtdklRt+OIH8YAC1n4cd+S1EmwcFVostzplOMzTyzj3FYYk6YNWiHMo39xnbqhsaomRxCozRO4mbaKQD0WsJQ1V8K6NCaIVVQFCtt/iburLQNCZnwqvJQipVSDbLPy2oo6TZDl75oAMbUpDkz2QS9jaaodGdTNb34kN4Z3FuvUJm/vgDcqg3mT/kZ+AVDwS6PSdE8XnO0p5snI0q/SWRiJ/k2NlgwZ+F4tJS2V+2GGRGSFjcBzkDcqeyhgGHzsdBnGPQJypvqFdRV5uh/qsgxTtAyj9UfY8zlWkjvCY+FK8dRYE/OrTsfW8QcOhVXmgfkWkgoQxfsyZs1I6y4c/M1D61BsI0iuY712Gikxie3THMThc9rZzZCTZzwzuOxQRNG/vSJTh7wROc7xMlye2MO92SLMfdMihuLrULnmQ4JbtPOd1u5ym3XDupuGMsPcfcSn0ND2OeDJIScqC19hpYlNRXgYfYxdaRMtmScmXeUU5n+H9c4H2C2XLkMzmW4F26CWerU1eurExNVVZeObV3vli7szu7Yqy6qzq2Itvtcbk8rVW4rqeayVTXM9ET7usb7uu7uTPY27Np5aae3mBnU/EfyVh/IBgM9MeSHlH0tNR+YGtAsYapGO4jTnu9PyddZIiMkzXkGoYpZr51WeX6mhPxhivyuYCQTjTWy3yB6QVPEgYcuqzIwi0XEIElHAHY8YL9y01zrGmJspQbWcXXX136UaNUHgm0jpJPPwa4buF+LoXas3S92NEuzj2FcsfytqbFuoV8ZmaUO2K2XvC2jnD3PiYI6M3vcQm1WVTW3oHKPP6OefzZbN/PL/DVoKVyKKjRSU7PnmZy8TLNtgeDiWDwOS2ErD30nMZrNieQYC+eawIsStjZRVQHpy8Q8MFfudwT6A7gr3GHepj+mgikm0yQDWQLuR0tLSaEYjlvCHY+QyTKG4ki5gUWenit8BfzVhgaiQrwIYJhJ8VMXjf5Ky9xuffT/oGB29LLk/5gePWesq4oAbU3a8iKElR7Ibk85VfbjZ6Vaej3hrxe5YSuUoeq6+rcZ0wuXqbO73elo099tyMWDqpho5MmIoV2rV1WJai9HZX9kix1RDtNr0nbqKkFI9EOj6zoEvzb+qDxUcvD5iD/+5B+Qo+SXo5QPEBNF7sQR1n+jQDSEd4kMOhiF/FBlnF6+pS41EaH3W6voEhOPbyy1xOWBW/cPSyKXoejkN0Sz327EFQ76a6URJU2x83emOgQOtXxzRMDHqfgdIvem3A4pZovkCzsOjw9+FW0p37WDmP2TpBl5AoyjbsW47e9liztjM2ncEbToMwQlQsjI7APGEKi5McpjRQjWNklV/ojnbSy8tzT/Elvm3taj0R0Ooly7oVDYkhadVgMy1u3/0LslNZuv7HtvUixUoxGUUQq0f5IpD9Kn4wNx2uz8eEYPuFxfLKsP8tB4nEjXFMPiW2u/lckh7t6w/RLkkPo3y7ByqilBEXUiDJFTfyDcUBnnTsGnMgdf1V7y9Ol610e6PPD+BGn5IZvuSXnEbm7/u1Govdw3pJgCxvBMDUZnvEI7sebJQtjeONldjRexmPRKPBz0to8/23LD6fR8yRVoYgyCJ7oYvRqsVxKYwBk8VUqIqiLpXSIS8MzX+ldHb7WKbqel/1OEBXneO/Xh8fv2aCBoyOluj4auKon0nmtQxGd0K78ThDBUU33l2+suPWw5m68U6d/4QypaNNmRpIQ2Sz0QyS0aC1PovNgCWdF2bFHFPc4ZHF429DQtm9uG0KKhCRurPpodSzd04MFeuusIDr2i53ifoco7Bpmg4a2DbPr/zSOyTQG17kD5+OAZYzEFLSVhTJMwRNnziCYwBO1rViweV2a7uIYTlII2SzeMO/XQ83QhRa2/ZPdcjCu7B5bP3H3xMTd+3ZUz+U35fObbtmUy236z245EQRld7a6Yx/rnVh/h91zy6a87Z9Oe0+yFHda4DcFhJhiJs2OJoOQCDutzDf0xS++J/Xcud/miozFI0/xW+QPM+LnCpeYER+KJpOVZDLa8nj0kvKekliWwN+5lgctL5rWqL2Pdd6t6a7FvswtzrvhRWTWO+WoTiWk3tbnOnnWpt0+TrudtNr0nTAY9Rz0iIc80SCVar9dyLup/R2LYaXOkKuJ8NSDBc7yNDTBRO3ZdXt/uncdbLHrKGqnh2aXLZsd+j+Tp78PAAB4nGNgZGBgAOKNfB2f4vltvjJwM78AijDUqG5oRND/XzNPZboF5HIwMIFEAU0gC914nGNgZGBgDvqfBSRfMAAB81QGRgZUoAsAVvgDcQAAAHicY2BgYGB+MbQwAAzOKGUAAAAAAE4AmgDoAQoBLAFOAXABmgHEAe4CGgKcAugEmgS8BNYE8gUOBSoFegXQBf4GRAaWBrgHCAdqB+IIagikCLwJUAmYChAKLApWCpAK1grqCyALWgu6DAAMJnicY2BkYGDQZUxhEGUAASYg5gJCBob/YD4DABjKAb4AeJxtkT1OwzAYht/0D9FKCARiYfECC2r6M3ZkaPcO3dPUaVM5ceS4Fb0DJ+AQHIKBM3AIDsFb80mVUG3J3+PH7xcrCYBrfCHCcUTohvU4Grjg7o+bpBvhFvlBuI0eHoU79EPhLp4xEe7hFppPiFqXNHd4FW7gCm/CTfp34Rb5Q7iNe3wKd+i/hbtY4Ee4h6foxewK289TW9Zzvd6ZxJ3EiRba1bkt1SgenuRMl9olXq/U8qDq/XrsfaYyZws1taXXxlhVObvVqY833leTwSATH6e2gMEOBSz6yJGylqgx5/uu6Q0SuLOJc27BLseah73CCDG/57nkjMkypBN41hXTSxy41tjz5jGtR8Z9xoxlv8I09B7ThtPSVOFsS5PSx9iEror/bcCZ/cvH4fbiFyPgZJwAAAB4nG2O527DMAyEfY2dOo6T7r33dN9JkVjbiCIZlNWiffp6JEV/lICI78DTkcFa0FcS/F8Z1jBAiAhDrCPGCAnGSDHBFBvYxBa2sYNd7GEfBzjEEY5xglOc4RwXuMQVrnGDW9zhHg94xBOe8YJXZHgLUqHL3GSSTE2c9ELTez3ukcu8qBNhck2Zsp9mib2jw84R9+yrRDDbz6W1w97a4dLasa9GM8GZLATX4Yy0jqXQZJTgkSxIzheC52lDH2xNF/cr2sDJSvT3rZSvIqmtnA+kzSPJ1rm4/aqtUGPFIs8KYZSmWLGt2kFIqqwjag7iAX1R2rxMlU7MNKlwQcZHi9J4l1pWxKQyXbo6qgprqO21DSstvprmXdiM7ZCpXTVhcuU3LZcNHQmWReiNslNv/kYNfdX6Q++Ig+AH0BSSzQAAAA==)
      format('woff');
    font-weight: normal;
    font-style: normal;
  }

  html {
    --lumo-icons-align-center: '\\ea01';
    --lumo-icons-align-left: '\\ea02';
    --lumo-icons-align-right: '\\ea03';
    --lumo-icons-angle-down: '\\ea04';
    --lumo-icons-angle-left: '\\ea05';
    --lumo-icons-angle-right: '\\ea06';
    --lumo-icons-angle-up: '\\ea07';
    --lumo-icons-arrow-down: '\\ea08';
    --lumo-icons-arrow-left: '\\ea09';
    --lumo-icons-arrow-right: '\\ea0a';
    --lumo-icons-arrow-up: '\\ea0b';
    --lumo-icons-bar-chart: '\\ea0c';
    --lumo-icons-bell: '\\ea0d';
    --lumo-icons-calendar: '\\ea0e';
    --lumo-icons-checkmark: '\\ea0f';
    --lumo-icons-chevron-down: '\\ea10';
    --lumo-icons-chevron-left: '\\ea11';
    --lumo-icons-chevron-right: '\\ea12';
    --lumo-icons-chevron-up: '\\ea13';
    --lumo-icons-clock: '\\ea14';
    --lumo-icons-cog: '\\ea15';
    --lumo-icons-cross: '\\ea16';
    --lumo-icons-download: '\\ea17';
    --lumo-icons-drag-handle: '\\ea18';
    --lumo-icons-dropdown: '\\ea19';
    --lumo-icons-edit: '\\ea1a';
    --lumo-icons-error: '\\ea1b';
    --lumo-icons-eye: '\\ea1c';
    --lumo-icons-eye-disabled: '\\ea1d';
    --lumo-icons-menu: '\\ea1e';
    --lumo-icons-minus: '\\ea1f';
    --lumo-icons-ordered-list: '\\ea20';
    --lumo-icons-phone: '\\ea21';
    --lumo-icons-photo: '\\ea22';
    --lumo-icons-play: '\\ea23';
    --lumo-icons-plus: '\\ea24';
    --lumo-icons-redo: '\\ea25';
    --lumo-icons-reload: '\\ea26';
    --lumo-icons-resize-handle: '\\ea27';
    --lumo-icons-search: '\\ea28';
    --lumo-icons-undo: '\\ea29';
    --lumo-icons-unordered-list: '\\ea2a';
    --lumo-icons-upload: '\\ea2b';
    --lumo-icons-user: '\\ea2c';
  }
`;

addLumoGlobalStyles('font-icons', fontIcons);
