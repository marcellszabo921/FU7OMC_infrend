import Role from "../models/Role.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { CreateError } from "../utils/error.js";
import { CreateSuccess } from "../utils/success.js";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
    const role = await Role.findOne({ role: 'Berlo' });
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        companyName: req.body.companyName,
        email: req.body.email,
        taxNumber: req.body.taxNumber,
        companyNumber: req.body.companyNumber,
        headquarters: req.body.headquarters,
        password: hashPassword,
        roles: role
    });
    await newUser.save();
    return res.status(200).json("User registered successfully");
}

export const registerAdmin = async (req, res, next) => {
    const role = await Role.find({role: 'Admin'});
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        companyName: req.body.companyName,
        email: req.body.email,
        taxNumber: req.body.taxNumber,
        companyNumber: req.body.companyNumber,
        headquarters: req.body.headquarters,
        password: hashPassword,
        isAdmin: true,
        roles: role
    });
    await newUser.save();
    return next(CreateSuccess(200, "Admin registered successfully"));
}

export const login = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        .populate("roles", "role");

        const { roles } = user;
        if (!user) {
            return res.status(400).send("User not found");
        } const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordCorrect) {
            return next(CreateError(400, "Invalid credentials"));
        }
        
        const token = jwt.sign(
            {id: user._id, isAdmin: user.isAdmin, roles: roles},
            process.env.JWT_SECRET,{
                expiresIn: '30d'
            });

        res.cookie('access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
            })
        .status(200)
        .json({
            success: true, 
            message: "User logged in successfully", 
            roles,
            data: token,
            userId: user._id
        })
    } catch (error) {
        return next(CreateError(500,"Something went wrong"));
    }
}

export const logout = (req, res, next) => {
    try {
      res.clearCookie("access_token", { httpOnly: true, sameSite: "Lax" });
      return res.status(200).json({
        success: true,
        message: "User logged out successfully"
      });
    } catch (error) {
      return next(CreateError(500, "Something went wrong during logout"));
    }
  };