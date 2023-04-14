import dotenv from 'dotenv';

// dotenv.config({ path: __dirname + `/../../.env.${process.env.NODE_ENV}` }); // change according to your need
dotenv.config();

const config = {
  port: process.env.PORT,
  mongodb_url: process.env.MONGODB_URL,
  elastic_url: process.env.ELASTIC_URL,
  node_env: process.env.NODE_ENV,
  // dbPassword: process.env.DB_PASSWORD,
};

export default config;
