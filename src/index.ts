import dotenv from 'dotenv';
import express from 'express'
import { db} from './config/DB.config'
import routes from './routes/index.route'

dotenv.config();

const app = express();
const host = process.env.APP_HOST;
const port = process.env.APP_PORT;
const version = process.env.API_VERSION;

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(`/api/${version}`,routes());

db.then(() =>
app.listen(port, () => console.log(`Server started at ${host}:${port}/api/${version}/`))
);
