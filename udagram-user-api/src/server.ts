import cors from 'cors';
import express from 'express';
import {sequelize} from './sequelize';

import {IndexRouter} from './controllers/v0/index.router';

import bodyParser from 'body-parser';
import {config} from './config/config';
import logger from './logger'
import {V0_USER_MODELS} from './controllers/v0/model.index';

import * as jwt from 'jsonwebtoken';

(async () => {
  await sequelize.addModels(V0_USER_MODELS);
  await sequelize.sync();

  const app = express();
  const port = process.env.PORT || 8080;

  app.use(bodyParser.json());

  app.use(cors({
    allowedHeaders: [
      'Origin', 'X-Requested-With',
      'Content-Type', 'Accept',
      'X-Access-Token', 'Authorization',
    ],
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    origin: config.url,
  }));

  app.use((req, res, next) => {

    let user;

    if (!req.headers || !req.headers.authorization) {
      const tokenBearer = req.headers.authorization.split(' ');
        if (tokenBearer.length == 2) {
          const token = tokenBearer[1];
          jwt.verify(token, config.jwt.secret, (err, decoded) => {
            user = decoded
          });
        }
    }

    logger.info({
      Title: `User ${user} requested for resource`,
      URL: req.url,
      Method: req.method,
      Body: req.body
    });

    res.on("finish", () => {
      logger.info({
        Title: 'Resource response',
        StatusCode: res.statusCode,
        StatusMessage: res.statusMessage
      })
    });

    next();
  });

  app.use('/api/v0/', IndexRouter);

  // Root URI call
  app.get( '/', async ( req, res ) => {
    res.send( '/api/v0/' );
  } );


  // Start the Server
  app.listen( port, () => {
    console.log( `server running ${port}` );
    console.log( `press CTRL+C to stop server` );
  } );
})();
