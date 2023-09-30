import winston from 'winston';
import { ElasticsearchTransport } from 'winston-elasticsearch';
import ecsFormat from '@elastic/ecs-winston-format';
import Config from '../utils/configuration';

const elasticUrl = Config.elastic_url;

console.log('elastic url', elasticUrl);

const logger = winston.createLogger({
  format: ecsFormat({ convertErr: true }),
  transports: [
    new ElasticsearchTransport({
      level: 'info',
      indexPrefix: 'eltrello-',
      clientOpts: {
        node: elasticUrl,
      },
    }),
    new winston.transports.Console(),
  ],
  exceptionHandlers: [
    new ElasticsearchTransport({
        level: 'error',
        indexPrefix: 'eltrello-',
        clientOpts: {
            node: elasticUrl
        }
    })
  ]
});

export default logger;
