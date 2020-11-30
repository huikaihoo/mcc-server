import express from 'express';
import passport from 'passport';

import auth from './auth';
import config from './config';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.json('Hello World');
});

app.get('/clinic', passport.authenticate('token', { session: false }), (req: any, res) => {
  res.json({
    id: req.user.id,
    username: req.user.username,
  });
});

app.post('/signin', passport.authenticate('local', { session: false }), auth);

app.listen(config.port, () => {
  console.log(`Server started at port ${config.port}`);
});
