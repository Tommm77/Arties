import { Router } from 'express';

import { ping } from './ping';

export function getRouter() {
  const router = Router();

  router.get('/ping', ping);

  return router;
}
