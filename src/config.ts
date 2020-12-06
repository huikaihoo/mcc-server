import dotenv from 'dotenv';

dotenv.config();

const getDBUri = () => {
  if (process.env.POSTGRES_HOST && process.env.POSTGRES_DB && process.env.POSTGRES_USER && process.env.POSTGRES_PASSWORD && process.env.POSTGRES_PORT && process.env.POSTGRES_TEST_PORT) {
    if (process.env.NODE_ENV === 'TEST') {
      return `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_TEST_PORT}/${process.env.POSTGRES_DB}`;
    }
    return `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`;
  }
};

export interface IConfig {
  nodeEnv: string;
  enableCors: boolean;
  host: string;
  port: string;
  saltRounds: number;
  accessTokenSecret: string;
  refreshTokenSecret: string;
  accessTokenExpiresIn: string;
  refreshTokenExpiresIn: string;
  dbUri: string;
}

const config: IConfig = {
  nodeEnv: process.env.NODE_ENV || '',
  enableCors: process.env.ENABLE_CORS === 'true',
  host: process.env.HOST || 'http://localhost',
  port: process.env.PORT || '3000',
  saltRounds: parseInt(process.env.SALT_ROUNDS || '10', 10),
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || 'a_secret',
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || 'r_secret',
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES || '3m',
  refreshTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES || '1d',
  dbUri: getDBUri() || '',
};

export default config;
