## API Arties

Ceci est un projet de test, fausse API consistant en des fichiers JSON (au lieu de postgreSQL), et un programme NodeJS+Express+Typescript `src/`. Grâce à cette API les utilisateurs (application flutter, site web) font pouvoir loader les artistes et leurs évènements, avec éventuellement des fourchettes de temps.

### Lancer le projet

Normalement les deux scripts suivants suffisent à lancer le projet en mode dev. Normalement ça tourne sur `localhost:3001`

```sh
npm i
npm run start:dev

# Essayer le endpoint suivant pour s'assurer que ça marche
# http://localhost:3001/ping

```

### Données

3 tables dans notre db:

- Artists : `artists.json`, `id: number; name: string`
- Events : `events.json`, `id: number; artists: artists ID; name: string`
- Occurrences : `occurrences.json`, `id: number; event: event ID; time: string`

Relations :

- Artist --- has many --> Events
- Event --- has many --> Occurrences

### Exercice

Le but de l'exercice est de construire des endpoints pour notre API (autre que `/ping`). Au lieu de lire dans une DB postgreSQL comme on l'aurait fait en production, on va donc lire dans les fichiers JSON pour simplifier.

#### Endpoint 1

`GET /artists/1?withEvents=true`

Si l'artiste avec l'ID est trouvé, renvoie code `200` et l'artiste en question en JSON. Sinon renvoie code d'erreur `404`.

Si il y a `?withEvents=true`, "populater" `artists.events` avec les évènements de l'artiste **seulement les évènements qui ont au moins une occurence dans le futur**. Sinon ne pas populater `artists.events`.

Exemple de réponse :

```json
  {
    "name": "Jean Dujardin",
    "id": 2,
    "events": [{
        "name": "Jean Dujardin - Olympic Café",
        "id": 2,
        "artists": 2
    }]
  },
```

#### Endpoint 2

`GET /event/1?withArtist=true`

Si l'event avec l'ID est trouvé, renvoie code `200` et l'event en question en JSON. Sinon renvoie code d'erreur `404`.

Si il y a `?withArtist=true`, "populater" `event.artists` avec l'artiste. Sinon ne pas populater `event.artists`.

Exemple de réponse :

```json
{
  "name": "Bob Dylan - Palace",
  "id": 7,
  "artists": {
    "name": "Bob Dylan",
    "id": 4
  }
}
```

#### Endpoint 3

`GET /occurrences?from=2023-11-10T21:00:00.000Z&to=2023-11-20T21:00:00.000Z`

Renvoie toutes les occurrences qui sont comprise entre le `from` (superior or equal) et le `to` (inferior or equel).

Si il y a `?withEvent=true`, "populater" `occurrence.event` avec l'event. Sinon ne pas populater `occurrence.event`.

Exemple de réponse :

```json
[
  {
    "event": 3,
    "time": "2023-11-11T18:00:00.000Z"
  },
  {
    "event": 4,
    "time": "2023-11-12T21:00:00.000Z"
  },
  {
    "event": 4,
    "time": "2023-11-013T21:00:00.000Z"
  }
]
```

#### Endpoint 4

`GET /events?from=2023-11-10T21:00:00.000Z&to=2023-11-20T21:00:00.000Z`

Renvoie tous les évènements qui ont au moins une occurrence comprise entre le `from` (superior or equal) et le `to` (inferior or equal). Pour chaque évènement on populate `event.occurrences` avec seulement les occurrences qui matchent.

Exemple de réponse :

```json
[
  {
    "name": "Bob Dylan - Palace",
    "id": 7,
    "occurrences": [
      {
        "event": 4,
        "time": "2023-11-12T21:00:00.000Z"
      },
      {
        "event": 4,
        "time": "2023-11-013T21:00:00.000Z"
      }
    ]
  },
  {
    "name": "Jean Dujardin - Royal",
    "id": 7,
    "occurrences": [
      {
        "event": 4,
        "time": "2023-11-12T19:00:00.000Z"
      },
      {
        "event": 4,
        "time": "2023-11-013T21:00:00.000Z"
      }
    ]
  }
]
```

#### Important

Assurez-vous de cheecker les user inputs notamment les paramètres comme `from`, `to` et `withArtist` etc. Le serveur ne doit pas crasher. Si un seul paramètre est invalide, ou un paramètre requis est absent on peut renvoyer le code d'erreur `403`.

Critères retenus :

- coder les 4 endpoints
- respecter la structure des fichiers qu'on peut deviner avec `src/routes/index.ts` et `src/routes/ping.ts`
- respect des consignes
- noms de variables explicites
- clean code
- code le plus simple possible, aucune surcomplication
