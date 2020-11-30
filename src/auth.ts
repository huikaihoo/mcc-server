import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import passportJWT from 'passport-jwt';
import passportLocal from 'passport-local';

import config from './config';
import Users from './users';

const LocalStrategy = passportLocal.Strategy;
const JWTStrategy = passportJWT.Strategy;
const extractJWT = passportJWT.ExtractJwt;

const checkPassword = async (user: any, password: any): Promise<any> => {
  const isMatch = await bcrypt.compare(password, user.password);
  return isMatch ? user : null;
};

// Auth for login
passport.use(
  'local',
  new LocalStrategy((username, password, done) => {
    Users.findOne(username)
      .then(user => checkPassword(user, password))
      .then(user => done(null, user))
      .catch(err => done(err, false));
  })
);

// Auth for access token
passport.use(
  'token',
  new JWTStrategy(
    {
      jwtFromRequest: extractJWT.fromBodyField('accessToken'),
      secretOrKey: config.accessTokenSecret,
    },
    (jwtPayload, done) => {
      Users.findById(jwtPayload.id)
        .then(user => done(null, user))
        .catch(err => done(err));
    }
  )
);

const auth = (req: any, res: any) => {
  const token = jwt.sign(
    {
      username: req.user.username,
    },
    config.accessTokenSecret,
    {
      expiresIn: config.accessTokenExpiresIn,
    }
  );
  res.json({ accessToken: token });
};

export default auth;
