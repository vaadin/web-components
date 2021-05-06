/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './version.js';

const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `
  <style>
    @font-face {
      font-family: 'material-icons';
      src: url(data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAAAi8AAsAAAAADZQAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABHU1VCAAABCAAAADsAAABUIIslek9TLzIAAAFEAAAARAAAAFZSk1xEY21hcAAAAYgAAACNAAACNOuCXH5nbHlmAAACGAAABDgAAAXsdK8UGGhlYWQAAAZQAAAAMAAAADZhSa2YaGhlYQAABoAAAAAgAAAAJBGyCLpobXR4AAAGoAAAABMAAABAjXoAAGxvY2EAAAa0AAAAIgAAACIKIgjUbWF4cAAABtgAAAAfAAAAIAEeAFRuYW1lAAAG+AAAATQAAAJe3l764XBvc3QAAAgsAAAAkAAAAMondETCeJxjYGRgYOBiMGCwY2BycfMJYeDLSSzJY5BiYGGAAJA8MpsxJzM9kYEDxgPKsYBpDiBmg4gCACY7BUgAeJxjYOS4wTiBgZWBga2WbQIDA2MAhGZpYChlymZgYGJgZWbACgLSXFMYHF4xvuJnv/CvgOEG+wXG6UBhRpAcAA0HDXt4nO2R2Q0DIQxEHwt7HzSSGlJQvlJkqqGJjYdJGbH0PPJgELKBEcjBIyiQ3iQUr3BT9zNb9wvP3lPkt3rfkZNy1KXnIXpLvDgxs7DGvZ2Dk4saxxP/OHr+/KqqCZo+08EgzUa7acVoym002lubDNLZIF0M0tUg3Yz22XaD9DD6XTsN0ssgrYb6BZEQJiUAAAB4nH1UbUhbVxg+77259yZMJbckprDhbnKt0cYlaz5u9kONYOtWG+tYq9QxHQn9mDYjcfOHWPrBuoFDrvVHV+uPlRWlExxMSJgQZLQ/BqHCpsUfghZX1jHBjBUW2ky9ZzvnxqzKRm9uzn3POc97zvs+53kPAkQeYYFvREaEwAmiLIIAwoKqLWa0ByOsxEqq9sBwbyvEeEa2f0Z78TYQfSIEAUZVxpNh3ARB8Ix7K2S4py0Sb8QghJeMN4UYehm9SjzkgGy1k7/sKAOraKkAn93bAAHR7wbWLtqFhdOZ7f2Z08p7Cnn5xsL3r7t8Iz+ZIY/e2TWZz3OWQkxGP3cbcQiZQDCBk/0Uvz/CeAwzKlyG2yQZYhVwPMcNUBw4TSRwnlO1KeaUihXDBrG0KRXmd3CNOziynA3YdRXuY0VlTnEDKg7gALF2uIhxq+ilwnoUSlcVYmRHbZFwojeMh3S5NtLo1vMJ4s4i9PcbhB8j2o8OoSBZxyHwSODNtnJkK5eCCgoqZmcVclaxDqcbnFXmYAMEFclWAbZys1AGAs/K9AgM386nk3gjfPx4GKzJNIylk2ANt7WF8UYyPT9xffRhfShU/3D0OjQ/t/tuMKXHcINgJLBsKo170ymcpU5gSaXhRjoFlnBbPv8fP5zWbc6iTeEfLgBNX+dskl2nJ25imDnIQY5dxyWQ25PjK0h6UY5ywBeQRZ9hZv7/IilEeY4K4cUhb1ZmMuSACvwSbWzzZWgfcqK64t7/brzDbBUlVqG8llNaecKqg7YW2vfSGT/FGGaeri3j2Y4OOLq8Btm1ZTja0YFnl9eeDvX3NR0+3NTXD+aiNfROc1N1TU11U/Nk0eDLIl14emUFT3dFIl3QvrIC7V2RrYq9jvgJtVhpj6tuIGQg9dRjWhMWUBk6QPJ5E6EDvCxR9pR9Qao94K0WXR0+b9DJy3puAX/QBErArytIdghOxSdR8nmGDPu8NEmrhf9t6THO5TbweHfd3UtYGDauDm92VrsOjkXPxM9HUyWlneGW2lowRPFPiquGjl5M/P7LMyj5MwvnukM/al/iS5JDB3W39p6Fj/8YB9MHkB9+VjnMfR09Hz8THatxVSfhNVdLuLO0VMvAocRFOnrQpWTf7TmL1Sdf4Sx8BFf5WldLa6cd7aoxoisQgZUMYW51c4iZQ7vuIjfpkDQlvR7MxewJITIdkAuV49crhyYLdpH/NX6tIOO6UKiOSHpiduLWo9qFmqlE/5XBeOyO2+Nx34nFc/HeE/h7Zo5rj+/VPhGc+E3/d17/Dox6vO4+SbE0LIY2pgiJrRK5CtHpzNN46K94RnZdXAFdXSCSG5DcItccvT3jt5IjVy/fD31xYfDIW/oWg5xFF1moviem9eAEXtJL7PH08Oetb/u8swPmkyeufHazELuuv08SHzYdwY9wAkYhh0v+AZEDywV4nGNgZGBgAOIpkyQmxvPbfGXg5kwAijDUqG5oRND/Mjnvs18AcjkYmECiACYJCrl4nGNgZGBgv/CvgIGBy4qB4f9/zvsMQBEUIAAAh7AFgnicY2BgYOBMIB5zWaHyAb1WBgMAAAAAAAAYADAAYgB2AIoAngDAASQBMgFwAdgCUAJeAqwC9gAAeJxjYGRgYBBg8GBgYQABJiDmAkIGhv9gPgMAEV4BcwB4nH2QvW7CMBSFTyBQlUhVpaqdGCxV6lIRfkbUGSRGBvYQHAhy4sgxSLxBH6RP0Ifo2AfpU/TEeIEBW3K++91znSgAHvGDAM0K8ODOZrVwx+rMbdKz55D86rmDCGPPXfoPzz28Y+E5whMOvCEI72n6+PTcYv7Lc5v+23NI/vXcwQv+PHfRD+C5h1XQ9xzhLTBFYqXJEzXIU13WS7k9qORKXlYraepcl2Icjy4bc1lKQ7MR65Ooj9uJtZnIjC7ETJdWKqVFZfRepjbeWVtNh8PM+zjVBQoksJAwyEkKAz5TaJSosaTf8l8odszN5K3eyvmapqkF/3+M0c2JOX3peufMhlNrnHjWOPKLJrQWGeuMGc27BGZutkkrbk1Tud6eJqWPsXNTFaYYcmdX+di9vfgHMdlwtnicbYzRDoIwFENXYIg6FN/8CT5qblch3LDlChL+Xhbim03a5iRNVaZ23dV/NciQo4BGiQMqHHHCGQY1LriiwU1drEhYWh+WcbHizY5zTFA5yzR6K9p15Aaz5UfC2DI9p/oH0r+6STumNOPghspLiOlP0/YlOa1kNre+f9sHky8i27UU4mB9OcdUSn0Bsp0xfg==) format('woff');
      font-weight: normal;
      font-style: normal;
    }

    html {
      --material-icons-arrow-downward: "\\ea01";
      --material-icons-arrow-upward: "\\ea02";
      --material-icons-calendar: "\\ea03";
      --material-icons-check: "\\ea04";
      --material-icons-chevron-left: "\\ea05";
      --material-icons-chevron-right: "\\ea06";
      --material-icons-clear: "\\ea07";
      --material-icons-clock: "\\ea08";
      --material-icons-dropdown: "\\ea09";
      --material-icons-error: "\\ea0a";
      --material-icons-eye: "\\ea0b";
      --material-icons-eye-disabled: "\\ea0c";
      --material-icons-play: "\\ea0d";
      --material-icons-reload: "\\ea0e";
      --material-icons-upload: "\\ea0f";
    }
  </style>
`;

document.head.appendChild($_documentContainer.content);
