import express from 'express';
import { getAllUsers, getById, getProfile } from '../controllers/user.controller.js';
import { verifyAdmin, verifyToken, verifyUser } from '../utils/verifyToken.js';

const router = express.Router();

//getall
router.get('/', verifyAdmin, getAllUsers);
//profile
router.get('/profile',verifyToken, getProfile);
//getbyid
router.get('/:id',verifyUser, getById);

export default router;