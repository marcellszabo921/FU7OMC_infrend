import express from 'express';
import { updateUser, deleteUser,getAllUsers, getById, getProfile } from '../controllers/user.controller.js';
import { verifyAdmin, verifyToken, verifyUser } from '../utils/verifyToken.js';

const router = express.Router();

//company
router.get('/all', verifyAdmin, getAllUsers);
router.put('/:id', verifyAdmin, updateUser);
router.delete('/:id', verifyAdmin, deleteUser);
//profile
router.get('/profile',verifyToken, getProfile);
//getbyid
router.get('/:id',verifyUser, getById);
export default router;