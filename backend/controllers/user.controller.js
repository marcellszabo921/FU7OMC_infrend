import User from "../models/User.js";
import { CreateError } from "../utils/error.js";
import { CreateSuccess } from "../utils/success.js";

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

export const getAllUsers = async (req, res, next) => {
    try {
      const users = await User.find().select('firstName lastName email companyName taxNumber companyNumber headquarters balance isAdmin');
      return res.status(200).json({
        success: true,
        message: "Users retrieved successfully",
        data: users
      });
    } catch (error) {
      return next(CreateError(500, error.message));
    }
  };

export const updateUser = async (req, res, next) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                companyName: req.body.companyName,
                taxNumber: req.body.taxNumber,
                companyNumber: req.body.companyNumber,
                headquarters: req.body.headquarters,
                balance: req.body.balance,
                isAdmin: req.body.isAdmin,
            },
            { new: true }
        );

        if (!updatedUser) {
            return next(CreateError(404, "User not found"));
        }

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: updatedUser,
        });
    } catch (err) {
        return next(CreateError(500, err.message));
    }
};


export const deleteUser = async (req, res, next) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);

        if (!deletedUser) {
            return next(CreateError(404, "User not found"));
        }

        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (err) {
        return next(CreateError(500, err.message));
    }
};


