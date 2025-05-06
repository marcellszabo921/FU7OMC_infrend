import express from 'express';
import {
    getMachines,
    addMachine,
    getUserRentals,
    depositToPartner,
    getPartnerTransactions,
    createRental,
    closeRental,
    updateMachine,
    deleteMachine
} from '../controllers/rentalSystem.controller.js';
import { verifyAdmin, verifyToken, verifyUser } from '../utils/verifyToken.js';

const router = express.Router();

// === Gépek ===
router.get('/machines', getMachines);
router.post('/machines/create', verifyAdmin, addMachine);
router.put('/:id', verifyAdmin, updateMachine);
router.delete('/:id', verifyAdmin, deleteMachine);

// === Partnerek ===
router.post('/deposit', verifyToken ,depositToPartner);

// === Tranzakciók ===
router.get('/transactions', verifyToken, getPartnerTransactions);

// === Kölcsönzések ===
router.post('/createrent', verifyToken, createRental);
router.get('/getuserrent', verifyToken, getUserRentals);
router.post('/closerent', verifyToken,closeRental);

export default router;
