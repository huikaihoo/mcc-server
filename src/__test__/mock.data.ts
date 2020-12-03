import bcrypt from 'bcrypt';
import config from '../config';

const usersCreate = [
  {
    email: 'test@hello.world',
    password: bcrypt.hashSync('Qwer12444%*', config.saltRounds),
    clinic: {
      clinicName: 'Hello Clinic',
      phone: '67812345',
      address: '88 Hello Street, KLN, Hong Kong',
    },
  },
  {
    email: 'john@west.world',
    password: bcrypt.hashSync('Z8uic!@#qq', config.saltRounds),
    clinic: {
      clinicName: 'John Clinic',
      phone: '12345678',
      address: '168 West Road, HKI, Hong Kong',
    },
  },
];

const usersReterive = [
  {
    email: 'test@hello.world',
    password: 'Qwer12444%*',
    clinicName: 'Hello Clinic',
    phone: '67812345',
    address: '88 Hello Street, KLN, Hong Kong',
  },
];

const invalidJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Inh4eCIsImNsaW5pY0lkIjoieHh4IiwiaWF0IjoxNjA3MDA2NTY0LCJleHAiOjE2MDcwMDY3NDR9.ui18EixhVrVzPyQHdQkiPx8qAWZ7Sz8XmI2AGZCeC7s';

const invalidUser = {
  email: '12345',
  phone: 'abcdefg',
};

export { usersCreate, usersReterive, invalidJwt, invalidUser };
