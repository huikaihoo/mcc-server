import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import passport from 'passport';

import auth from './auth';
import config from './config';
import user from './routes/user';

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
 *   Signin:
 *     type: object
 *     required:
 *       - email
 *       - password
 *     properties:
 *       email:
 *         type: string
 *       password:
 *         type: string
 *   CreateUser:
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
 *   GetUser:
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
 *            $ref: '#/definitions/Signin'
 *    responses:
 *      '200':
 *        description: OK
 *      '401':
 *        description: Unauthorized
 */
app.post('/v1/signin', passport.authenticate('local', { session: false }), auth);

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
 *            $ref: '#/definitions/CreateUser'
 *    responses:
 *      '201':
 *        description: Created
 *      '400':
 *        description: Bad Request
 */
app.post('/v1/user', user.create);

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
 *              $ref: '#/definitions/GetUser'
 *      '401':
 *        description: Unauthorized
 *      '404':
 *        description: Not Found
 */
app.get('/v1/user', passport.authenticate('token', { session: false }), user.getById);

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
