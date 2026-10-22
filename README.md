# Silhouette

Geography quiz: name the country from its shape. Part of the Geo Games family, each its own website: [Country Grid](https://hectorei19.github.io/country-grid/), [Connections](https://hectorei19.github.io/connections/), [Top 10](https://hectorei19.github.io/top10/) and [all the games](https://hectorei19.github.io/geo-games/).

Work in progress, built in phases: silhouettes and country data (done), Training, Daily, With friends.

- Three levels: Easy (54 well-known countries), Normal (all 196) and Hard (all 196, each shape turned by a random angle).
- `check.html` shows every silhouette, north up or turned, to look them over.

Files:
- `countries.js` – the 196 countries: English name, other accepted names, continent, flag, Easy or not, and the silhouette (an SVG path in a 100 × 100 box). Made by `tools/build-countries.js`; do not edit it by hand.
- `silhouette.js` – drawing a silhouette (turned and fitted to the box for Hard), the answer box's search (no accents, case or spaces needed; common other names such as Holland, Burma, UK), seeded random picks.
- `style.css` – Country Grid's styles (colours, fonts, dark mode), the same copy as in Top 10 and Connections.
- `tools/` – only to rebuild `countries.js`: `cd tools`, `npm install`, `node build-countries.js ../../top10/data.js` (any copy of Country Grid's `data.js`).

How the silhouettes are made: each country on its own map centred on itself (azimuthal equal-area), so nothing far from the equator is stretched and the date line never splits a country (Russia, Fiji, Kiribati). Far-off small parts are left out (French Guiana, Hawaii, Easter Island, the Canaries); big or nearby ones stay (Alaska, Svalbard, Sicily). Every shape fills the same box, so size gives nothing away. Outlines are simplified in screen units, a quarter of a pixel at 400 px, so small countries keep their detail. Nations made only of tiny atolls (Tuvalu, Maldives) keep all their islets, drawn as dots. Vatican City is left out: its border in the data is a single line.

Data sources and licences:
- Borders: [world-atlas](https://github.com/topojson/world-atlas) 2.0.2, from [Natural Earth](https://www.naturalearthdata.com/) 1:10m, public domain. Pieces Natural Earth keeps apart are joined to their country (Somaliland to Somalia, Northern Cyprus to Cyprus, Baikonur to Kazakhstan).
- Country names and continents: Country Grid's data, from [mledoze/countries](https://github.com/mledoze/countries), Open Database License (ODbL) 1.0.
- Fonts: Big Shoulders Display, Barlow Semi Condensed, JetBrains Mono (Google Fonts, SIL Open Font License).
