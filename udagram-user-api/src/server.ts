import cors from 'cors';
import express from 'express';
import {sequelize} from './sequelize';
import { v4 as uuidv4 } from 'uuid';

import {IndexRouter} from './controllers/v0/index.router';

import bodyParser from 'body-parser';
import {config} from './config/config';
import logger from './logger'
import {V0_USER_MODELS} from './controllers/v0/model.index';

import * as jwt from 'jsonwebtoken';
import { stringify } from 'querystring';

(async () => {
  await sequelize.addModels(V0_USER_MODELS);
  await sequelize.sync();

  const app = express();
  const port = process.env.PORT || 8081;

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

    if (req.headers && req.headers.authorization) {
      const tokenBearer = req.headers.authorization.split(' ');
        if (tokenBearer.length == 2) {
          const token = tokenBearer[1];
          jwt.verify(token, config.jwt.secret, (err, decoded) => {
            user = decoded
          });
        }
    }

    let pid = uuidv4();

    logger.info(JSON.stringify({
      URL: req.url,
      Method: req.method,
      Body: req.body
    }, null, '\t'), {
      label: `User ${user || 'no authenticated'} requested for resource`, 
      correlationId: pid
    })

    res.on("finish", () => {
      logger.info(JSON.stringify({
        StatusCode: res.statusCode,
        StatusMessage: res.statusMessage
      }, null, '\t'), {
        label: 'Resource response',
        correlationId: pid
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
