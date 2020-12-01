import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import passportJWT from 'passport-jwt';
import passportLocal from 'passport-local';

import config from './config';
import sequelize from './sequelize';

const models = sequelize.models;

const LocalStrategy = passportLocal.Strategy;
const JWTStrategy = passportJWT.Strategy;
const extractJWT = passportJWT.ExtractJwt;

const checkPassword = async (user: any, password: any): Promise<any> => {
  const isMatch = user?.password ? await bcrypt.compare(password, user.password) : false;
  return isMatch ? user : null;
};

// Auth for login
passport.use(
  'local',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    (email, password, done) => {
      models.user
        .findOne({
          attributes: ['id', 'clinicId', 'password'],
          where: {
            email,
          },
        })
        .then(user => checkPassword(user, password))
        .then(user => done(null, user))
        .catch(err => done(err, false));
    }
  )
);

// Auth for access token
passport.use(
  'token',
  new JWTStrategy(
    {
      jwtFromRequest: extractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.accessTokenSecret,
    },
    (jwtPayload, done) => {
      models.user
        .findByPk(jwtPayload.id, {
          attributes: ['id', 'clinicId', 'email'],
        })
        .then(user => done(null, user))
        .catch(err => done(err));
    }
  )
);

// Generate access token
const auth = (req: any, res: any) => {
  const token = jwt.sign(
    {
      id: req.user.id,
      clinicId: req.user.clinicId,
    },
    config.accessTokenSecret,
    {
      expiresIn: config.accessTokenExpiresIn,
    }
  );
  res.json({ accessToken: token });
};

export default auth;
