import app from './app';
import config from './config';
import db from './db';

const main = async () => {
  await db.initDB();

  app.listen(config.port, () => {
    console.log(`Server started at port ${config.port}`);
  });
};

main();
