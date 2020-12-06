import bcrypt from 'bcrypt';
import moment from 'moment';
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
  {
    email: 'mary@tiny.world',
    password: bcrypt.hashSync('niisd*Ty--h', config.saltRounds),
    clinic: {
      clinicName: 'Mary Clinic',
      phone: '76588123',
      address: 'Room 103, Tiny Garden, NT, Hong Kong',
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
  {
    email: 'john@west.world',
    password: 'Z8uic!@#qq',
  },
  {
    email: 'mary@tiny.world',
    password: 'niisd*Ty--h',
  },
];

const genConsultation = (index: number, clinicId?: string) => {
  const record: any = {
    doctorName: `Doctor ${index}`,
    patientName: `Patient ${index}`,
    diagnosis: `Diagnosis ${index}`,
    medication: `Medication ${index}`,
    fee: 100 * index + 15.2,
    datetime: moment('2020-12-04T22:23:56.705Z').add(index, 'day').toDate(),
    followUp: index % 2 === 0,
  };
  if (clinicId) {
    record.clinicId = clinicId;
  }
  return record;
};

const consultationsReterive = [
  {
    doctorName: `Doctor 0`,
    patientName: `Patient 0`,
    diagnosis: `Diagnosis 0`,
    medication: `Medication 0`,
    fee: 15.2,
    datetime: '2020-12-04T22:23:56.705Z',
    followUp: true,
  },
];

const invalidJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IiIsImNsaW5pY0lkIjoiIiwiaWF0IjoxNjA3MDE1NzQwfQ.TgZ2xTaLhnWg4SSQ8TUHy9z7IIerucJ261jNd9eOa9o';

const invalidUser = {
  email: '12345',
  phone: 'abcdefg',
};

const invalidConsultation = {
  fee: -1,
  datetime: 'abcdefg',
};

export { usersCreate, usersReterive, genConsultation, consultationsReterive, invalidJwt, invalidUser, invalidConsultation };
