import express from 'express';
import { createPost, getPosts, updatePost, deletePost } from '../controllers/post.controller.js';
import { verifyAdmin } from '../utils/verifyToken.js';

const router = express.Router();

router.get('/', getPosts);
router.post('/create', verifyAdmin, createPost);
router.put('/:id', verifyAdmin, updatePost);
router.delete('/:id', verifyAdmin, deletePost);

export default router;
