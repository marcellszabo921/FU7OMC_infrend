import User from "../models/User.js";
import { CreateError } from "../utils/error.js";
import { CreateSuccess } from "../utils/success.js";

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({});
        return next(CreateSuccess(200, "Users retrieved successfully", users));
    } catch (error) {
        return next(CreateError(500, error.message));
    }
}

export const getById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return next(CreateError(404, "User not found"));
        }
        return next(CreateSuccess(200, "User retrieved successfully", user));
    } catch (error) {
        return next(CreateError(500, error.message));
    }
}

export const getProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).populate("roles", "role");
        
        if (!user) {
            return next(CreateError(404, "User not found"));
        }

        return res.status(200).json({
            success: true,
            message: "User retrieved successfully",
            data: user
          });
    } catch (error) {
        return next(CreateError(500, error.message));
    }
}


