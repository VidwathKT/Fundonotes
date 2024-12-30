import express, { Router } from 'express';
const router = express.Router();
import UserRoutes from './user.route'; 
import noteRoutes from './note.route';

const routes = (): Router => {

  router.use('/users',UserRoutes());
  router.use('/notes',noteRoutes());
  
  return router;
};

export default routes;