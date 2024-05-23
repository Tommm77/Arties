const fs = require('fs');

const hour = 3600 * 1000;
const day = hour * 24;

const places = [
  'Olympia',
  'Zenith',
  'Cathedrale Notre-Dame',
  'Bataclan',
  'Belleviloise',
  'Royal',
  'Royal',
  'Antre Magique ',
  'La Cigale',
  'Cirque dhiver',
  'Olympic',
  'Olympic Café',
  'Casino Palace',
  'Le Splendid',
  'Palace',
  'Trabendo',
  'Gaité Lyrique',
];
const artists = [
  {
    name: 'Bob Mercier',
    id: 1,
  },
  {
    name: 'Jean Dujardin',
    id: 2,
  },
  {
    name: 'Valerie Lermercier',
    id: 3,
  },
  {
    name: 'Bob Dylan',
    id: 4,
  },
];

const dates = [
  '2023-11-10T21:00:00.000Z',
  '2023-11-20T21:00:00.000Z',
  '2023-11-30T21:00:00.000Z',
  '2023-12-05T18:00:00.000Z',
  '2023-12-07T21:00:00.000Z',
  '2023-12-09T19:00:00.000Z',
];
const f = () => {
  const events = [];
  const occurrences = [];
  artists.forEach((a, ind) => {
    const n = Math.random() > 0.5 ? 2 : 3;
    for (let i = 0; i < n; i += 1) {
      const place = places[Math.floor(Math.random() * places.length)];

      events.push({
        name: `${a.name} - ${place}`,
        id: events.length,
        artist: a.id,
      });
      let date = dates[Math.floor(Math.random() * dates.length)];
      occurrences.push({ event: events.length, time: date });
      for (let i = 0; i < 12; i += 1) {
        date =
          Math.random() > 0.5
            ? new Date(new Date(date).getTime() + 2 * day).toISOString()
            : new Date(new Date(date).getTime() + 1 * day).toISOString();
        occurrences.push({ event: events.length, time: date });
      }
    }
  });

  fs.writeFileSync('./events.json', JSON.stringify(events, null, 2), 'utf8');
  fs.writeFileSync(
    './occurrences.json',
    JSON.stringify(occurrences, null, 2),
    'utf8'
  );
  fs.writeFileSync('./artists.json', JSON.stringify(artists, null, 2), 'utf8');
};

f();
