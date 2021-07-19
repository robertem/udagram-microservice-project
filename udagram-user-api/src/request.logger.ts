import logger from './logger';
import { config } from './config/config';

import {Request, Response, NextFunction} from 'express';
import { v4 as uuidv4 } from 'uuid';
import * as jwt from 'jsonwebtoken';

export function requestLoggingMiddleware(req: Request, res: Response, next: NextFunction) {
    let user = getUserFromRequest(req);
    let correlationId = getCorrelationId();

    logger.info(JSON.stringify({
      URL: req.url,
      Method: req.method,
      Body: req.body
    }, null, '\t'), {
      label: `User ${user || 'no authenticated'} requested for resource`, 
      correlationId: correlationId
    });

    res.on("finish", () => {
      logger.info(JSON.stringify({
        StatusCode: res.statusCode,
        StatusMessage: res.statusMessage
      }, null, '\t'), {
        label: 'Resource response',
        correlationId: correlationId
      })
    });

    next();
}

function getUserFromRequest(req: Request): string {
    if (req.headers && req.headers.authorization) {
        const tokenBearer = req.headers.authorization.split(' ');
        if (tokenBearer.length == 2) {
        const token = tokenBearer[1];
        jwt.verify(token, config.jwt.secret, (err, decoded) => {
            if (err) return undefined;

            return decoded
        });
        }
    }
    return undefined;
}

function getCorrelationId() {
    return uuidv4();
}