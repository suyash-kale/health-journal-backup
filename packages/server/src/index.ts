import 'reflect-metadata';
import http from 'http';
import path from 'path';
import express from 'express';
import { useExpressServer } from 'routing-controllers';

import mung from './middleware/mung';
import {
  authorizationChecker,
  currentUserChecker,
} from './utility/authorization';

const PORT = process.env.PORT;
const expressApp = express();

expressApp.use(mung);

const app = useExpressServer(expressApp, {
  cors: process.env.NODE_ENV === 'development',
  routePrefix: '/api',
  controllers: [
    path.join(__dirname, '/controller/**/*.ts'),
    path.join(__dirname, '/controller/**/*.js'),
  ],
  authorizationChecker,
  currentUserChecker,
  validation: {
    validationError: {
      target: false,
      value: false,
    },
  },
});

expressApp.use(express.static(path.join(__dirname, '../../client/build')));
expressApp.use(express.static(path.join(__dirname, '../public')));

new http.Server(app).listen(PORT, () => {
  console.log(`Server is up & running on port ${PORT}.`);
});
