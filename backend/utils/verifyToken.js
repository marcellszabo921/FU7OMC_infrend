import jwt from 'jsonwebtoken';
import { CreateError } from './error.js';

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token)
        return next(CreateError(401, "Access denied"));
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return next(CreateError(403, "Invalid token"));
        } else {
            req.user = user;
        }
        next();
    })
}

export const verifyUser = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            return next(CreateError(403, "Unauthorized"));
        }
    })
}

export const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            return next(CreateError(403, "Unauthorized"));
        }
    })
}