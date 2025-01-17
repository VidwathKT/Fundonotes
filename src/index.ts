import dotenv from 'dotenv';
import express from 'express'
import { db} from './config/DB.config'
import routes from './routes/index.route'
import {createLogger} from './config/logger';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger/swagger.json';

dotenv.config();

const app = express();
const host = process.env.APP_HOST;
const port = process.env.APP_PORT;
const version = process.env.API_VERSION;

const logger = createLogger();
const morgonLogStream = {
    write: (message: string): void => {
      logger.info(message.trim());
    },
  };

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(morgan('combined', { stream: morgonLogStream }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(`/api/${version}`,routes());

db.then(() =>
app.listen(port, () => console.log(`Server started at ${host}:${port}/api/${version}/`)));

export { app };
