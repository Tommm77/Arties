import { Router } from 'express';

import { ping } from './ping';
import {getArtistById} from "./artists";
import {getEventById, getEventsByDateRange} from "./event";
import {getOccurrences} from "./occurences";

export function getRouter() {
  const router = Router();

  router.get('/ping', ping);
  router.get('/artists/:id', getArtistById);
  router.get('/events/:id', getEventById);
  router.get('/occurrences', getOccurrences);
  router.get('/events', getEventsByDateRange)

  return router;
}
