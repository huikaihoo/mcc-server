import app from './app';
import config from './config';
import db from './db';

const main = async () => {
  await db.connect();

  app.listen(config.port, () => {
    console.log(`Server started at port ${config.port}`);
  });
};

process.on('exit', async () => {
  await db.close();
});

main();
