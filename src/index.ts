import http from 'http';
import express from 'express';
import 'dotenv/config';

import { getRouter } from './routes';

async function start() {
  const app = express();
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Request-Method',
      'POST, GET, PUT, DELETE, PATCH'
    );
    res.header(
      'Access-Control-Allow-Headers',
      'Auth, Accept, Content-Type, Authorization, X-Requested-With'
    );
    res.header('Strict-Transport-Security', 'max-age=63072000');
    next();
  });

  console.log('Listening for HTTP on address 127.0.0.1:3001 !');
  app.use('/', getRouter());

  const serverHttp = http.createServer(app);
  serverHttp.listen(3001);
}

start();
