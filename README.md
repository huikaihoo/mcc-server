# mcc-server

## Start server with docker

```
docker-compose build
docker-compose up -d
```

## Start server in local

```
yarn install
yarn start:ts
```

## Useful commands

```
yarn dev # start server for development
yarn generate # Generate a sample clinic user and consultation records
```

## Unit test

```
yarn test
open data/report/index.html               # test result report
open data/coverage/lcov-report/index.html # test coverage report
```

## API Document

- Visit http://localhost:3000/api-docs/ after starting the server

## TO-DO

- Add support of refresh token for sign in
- Allow sign and verify JWT using public / private key pairs
