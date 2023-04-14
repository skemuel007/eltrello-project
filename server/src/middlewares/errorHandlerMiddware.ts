import { NextFunction, Request, Response } from 'express';
import logger from '../logger/logger';

function errorHandlerMiddlware(err: Error, req: Request, res: Response, next: NextFunction) {
  logger.info(err.stack);

  return res.status(500).json({
    message: 'An error occured on the server. Please try again later.',
  });
}

export default errorHandlerMiddlware;
