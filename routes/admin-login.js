import express from 'express';
export const router = express.Router();

import * as AdminController from '../controller/adminsController.js';

router.post('/', AdminController.handleLogin);
