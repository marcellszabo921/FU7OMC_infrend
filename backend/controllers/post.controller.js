import Post from '../models/Post.js';
import { CreateError } from "../utils/error.js";

export const createPost = async (req, res, next) => {
  try {
    const newPost = new Post(req.body);
    await newPost.save();
    res.status(201).json({ success: true, data: newPost });
  } catch (err) {
    next(CreateError(500, err.message));
  }
};

export const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: posts });
  } catch (err) {
    next(CreateError(500, err.message));
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const updated = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return next(CreateError(404, 'Post not found'));
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    next(CreateError(500, err.message));
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const deleted = await Post.findByIdAndDelete(req.params.id);
    if (!deleted) return next(CreateError(404, 'Post not found'));
    res.status(200).json({ success: true, message: 'Post deleted' });
  } catch (err) {
    next(CreateError(500, err.message));
  }
};
