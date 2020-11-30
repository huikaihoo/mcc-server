import bcrypt from 'bcrypt';
import config from './config';

const users = [
  { id: '1', username: 'admin', password: bcrypt.hashSync('admin1234', config.saltRounds) },
  { id: '2', username: 'user', password: bcrypt.hashSync('user1234', config.saltRounds) },
];

const tableById: { [key: string]: any } = { '1': users[0], '2': users[1] };
const tableByName: { [key: string]: any } = { admin: users[0], user: users[1] };

const findById = async (id: string): Promise<any> => {
  return tableById[id] || null;
};

const findOne = async (name: string): Promise<any> => {
  return tableByName[name] || null;
};

export default {
  findById,
  findOne,
};
