import { NextFunction, Response } from 'express';
import { ExpressRequestInterface } from '../types/expressRequest.interface';
import logger from '../logger/logger';

export default async (req: ExpressRequestInterface, res: Response, next: NextFunction) => {
  const { method, url, query, body } = req;

  res.on('finish', () => {
    const { statusCode } = res;

    logger.info({
      message: 'Request completed',
      method,
      url,
      query,
      body,
      statusCode,
    });
  });

  next();
};
