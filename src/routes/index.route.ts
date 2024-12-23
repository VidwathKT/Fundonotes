import express, { Router } from 'express';
const router = express.Router();
import UserRoutes from './user.route'; 


const routes = (): Router => {

  router.use('/users',UserRoutes());
  return router;
};

export default routes;