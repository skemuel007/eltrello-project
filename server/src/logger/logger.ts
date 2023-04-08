import winston from 'winston';
import { ElasticsearchTransport } from 'winston-elasticsearch';
import ecsFormat from '@elastic/ecs-winston-format';

const logger = winston.createLogger({
  format: ecsFormat({ convertErr: true}),
  transports: [
    new ElasticsearchTransport({
      level: 'info',
      indexPrefix: 'eltrello-',
      clientOpts: {
        node: 'http://localhost:9200',
      },
    }),
    new winston.transports.Console(),
  ],
});

export default logger;
