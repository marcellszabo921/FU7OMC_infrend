import express from 'express';
import { login, logout, register, registerAdmin } from '../controllers/auth.controller.js';

const router = express.Router();

//register
router.post('/register', register);

//login
router.post("/login", login);

//reg as admin
router.post("/register-admin", registerAdmin);

//logout
router.post('/logout', logout);

export default router;