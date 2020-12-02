import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import passport from 'passport';

import auth from './auth';
import config from './config';
import user from './routes/user';
import consultation from './routes/consultation';

const routeHandler = (handler: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res);
    } catch (err) {
      next(err);
    }
  };
};

const swaggerOptions: swaggerJsDoc.Options = {
  swaggerDefinition: {
    openapi: '3.0.3',
    info: {
      version: '1.0.0',
      title: 'Medical App API',
    },
    servers: [
      {
        url: `http://localhost:${config.port}`,
      },
    ],
  },
  apis: ['./src/app.ts'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

const app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * definitions:
 *   SigninReq:
 *     type: object
 *     required:
 *       - email
 *       - password
 *     properties:
 *       email:
 *         type: string
 *       password:
 *         type: string
 *   SigninRes:
 *     type: object
 *     properties:
 *       accessToken:
 *         type: string
 *   CreateUserReq:
 *     type: object
 *     required:
 *       - email
 *       - password
 *       - clinicName
 *       - phone
 *       - address
 *     properties:
 *       email:
 *         type: string
 *       password:
 *         type: string
 *       clinicName:
 *         type: string
 *       phone:
 *         type: string
 *       address:
 *         type: string
 *   GetUserRes:
 *     type: object
 *     properties:
 *       email:
 *         type: string
 *       clinicName:
 *         type: string
 *       phone:
 *         type: string
 *       address:
 *         type: string
 *   CreateConsultationReq:
 *     type: object
 *     required:
 *       - doctorName
 *       - patientName
 *       - diagnosis
 *       - medication
 *       - fee
 *       - datetime
 *       - followUp
 *     properties:
 *       doctorName:
 *         type: string
 *       patientName:
 *         type: string
 *       diagnosis:
 *         type: string
 *       medication:
 *         type: string
 *       fee:
 *         type: number
 *       datetime:
 *         type: string
 *       followUp:
 *         type: string
 *   CreateConsultationRes:
 *     type: object
 *     properties:
 *       id:
 *         type: string
 *   GetConsultationRes:
 *     type: object
 *     properties:
 *       id:
 *         type: string
 *       doctorName:
 *         type: string
 *       patientName:
 *         type: string
 *       diagnosis:
 *         type: string
 *       medication:
 *         type: string
 *       fee:
 *         type: number
 *       datetime:
 *         type: string
 *       followUp:
 *         type: string
 *   GetConsultationsRes:
 *     type: object
 *     properties:
 *       total:
 *         type: number
 *       results:
 *         type: array
 *         items:
 *           $ref: '#/definitions/GetConsultationRes'
 */

/**
 * @swagger
 * /health:
 *  get:
 *    summary: Health check
 *    responses:
 *      '200':
 *        description: OK
 */
app.get('/health', (req: Request, res: Response) => {
  res.status(200).end();
});

/**
 * @swagger
 * /v1/signin:
 *  post:
 *    summary: Sign in
 *    consumes:
 *      - application/json
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/definitions/SigninReq'
 *    responses:
 *      '200':
 *        description: OK
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/definitions/SigninRes'
 *      '401':
 *        description: Unauthorized
 */
app.post('/v1/signin', passport.authenticate('local', { session: false }), routeHandler(auth));

/**
 * @swagger
 * /v1/user:
 *  post:
 *    summary: Create new clinic user
 *    consumes:
 *      - application/json
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/definitions/CreateUserReq'
 *    responses:
 *      '201':
 *        description: Created
 *      '400':
 *        description: Bad Request
 */
app.post('/v1/user', routeHandler(user.create));

/**
 * @swagger
 * /v1/user:
 *  get:
 *    summary: Get clinic user
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      '200':
 *        description: OK
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/definitions/GetUserRes'
 *      '401':
 *        description: Unauthorized
 *      '404':
 *        description: Not Found
 */
app.get('/v1/user', passport.authenticate('token', { session: false }), routeHandler(user.getById));

/**
 * @swagger
 * /v1/consultation:
 *  post:
 *    summary: Create new consultation record
 *    security:
 *      - bearerAuth: []
 *    consumes:
 *      - application/json
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/definitions/CreateConsultationReq'
 *    responses:
 *      '201':
 *        description: Created
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/definitions/CreateConsultationRes'
 *      '400':
 *        description: Bad Request
 */
app.post('/v1/consultation', passport.authenticate('token', { session: false }), routeHandler(consultation.create));

/**
 * @swagger
 * /v1/consultation/{consultationId}:
 *  get:
 *    summary: Get consultation record by id
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: consultationId
 *        required: true
 *        schema:
 *          type: string
 *      - in: query
 *        name: offset
 *        schema:
 *          type: number
 *      - in: query
 *        name: limit
 *        schema:
 *          type: number
 *    responses:
 *      '200':
 *        description: OK
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/definitions/GetConsultationRes'
 *      '401':
 *        description: Unauthorized
 *      '404':
 *        description: Not Found
 */
app.get('/v1/consultation/:consultationId', passport.authenticate('token', { session: false }), routeHandler(consultation.getById));

/**
 * @swagger
 * /v1/consultations:
 *  get:
 *    summary: Get consultation records
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      '200':
 *        description: OK
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/definitions/GetConsultationsRes'
 *      '401':
 *        description: Unauthorized
 */
app.get('/v1/consultations', passport.authenticate('token', { session: false }), routeHandler(consultation.getList));

// Exception Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (!err) return next();
  console.log(err);
  res.status(err.status || 500).end();
});

// Handle 404 Not Found
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).end();
});

export default app;
