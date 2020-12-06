import bcrypt from 'bcrypt';
import moment from 'moment';
import config from '../config';

const usersCreate = [
  {
    email: 'test@hello.world',
    password: bcrypt.hashSync('3627909a29c31381a071ec27f7c9ca97726182aed29a7ddd2e54353322cfb30abb9e3a6df2ac2c20fe23436311d678564d0c8d305930575f60e2d3d048184d79', config.saltRounds),
    clinic: {
      clinicName: 'Hello Clinic',
      phone: '67812345',
      address: '88 Hello Street, KLN, Hong Kong',
    },
  },
  {
    email: 'john@west.world',
    password: bcrypt.hashSync('c0225bde4916276b2058e16c4a00e27557c65472e318e0746523c71b85288ef87a424f9c88dcccbdde9755615327e365aa90f60c813b4d2997306a9cfab168d6', config.saltRounds),
    clinic: {
      clinicName: 'John Clinic',
      phone: '12345678',
      address: '168 West Road, HKI, Hong Kong',
    },
  },
  {
    email: 'mary@tiny.world',
    password: bcrypt.hashSync('417a61108059bf2947ab54edac1bc30d134c4c5ca1fcb1e153b2d39aa7a9a0df4f9799e237d141303e72945d82648eb08998eb2cb233e37e54bf5feb10cf0ccd', config.saltRounds),
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
    password: '3627909a29c31381a071ec27f7c9ca97726182aed29a7ddd2e54353322cfb30abb9e3a6df2ac2c20fe23436311d678564d0c8d305930575f60e2d3d048184d79',
    clinicName: 'Hello Clinic',
    phone: '67812345',
    address: '88 Hello Street, KLN, Hong Kong',
  },
  {
    email: 'john@west.world',
    password: 'c0225bde4916276b2058e16c4a00e27557c65472e318e0746523c71b85288ef87a424f9c88dcccbdde9755615327e365aa90f60c813b4d2997306a9cfab168d6',
  },
  {
    email: 'mary@tiny.world',
    password: '417a61108059bf2947ab54edac1bc30d134c4c5ca1fcb1e153b2d39aa7a9a0df4f9799e237d141303e72945d82648eb08998eb2cb233e37e54bf5feb10cf0ccd',
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
  password: 'abc1234',
};

const invalidConsultation = {
  fee: -1,
  datetime: 'abcdefg',
};

export { usersCreate, usersReterive, genConsultation, consultationsReterive, invalidJwt, invalidUser, invalidConsultation };
