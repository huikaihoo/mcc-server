export interface IConfig {
  port: string;
  saltRounds: number;
  accessTokenSecret: string;
  refreshTokenSecret: string;
  accessTokenExpiresIn: string;
  refreshTokenExpiresIn: string;
}

const config: IConfig = {
  port: process.env.PORT || '3000',
  saltRounds: parseInt(process.env.SALT_ROUNDS || '10', 10),
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || 'a_secret',
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || 'r_secret',
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES || '3m',
  refreshTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES || '1d',
};

export default config;
