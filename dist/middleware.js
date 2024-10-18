"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app = (0, express_1.default)();
require('dotenv').config();
app.use(express_1.default.json());
function middleware(req, res, next) {
    const jwtSecret = process.env.JWT_PASSWORd;
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        // Respond with 403 Forbidden if the Authorization header is missing or not in the correct format
        return res.status(403).json({ msg: "No token provided or invalid format" });
    }
    const token = authHeader;
    // console.log("This is token ", token);
    if (!token) {
        return res.status(400).json({
            msg: "Token not provided "
        });
    }
    if (!jwtSecret) {
        return res.status(400).json({
            msg: "Jwt secret is not defiend "
        });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        req.id = decoded.id;
        next();
    }
    catch (error) {
        return res.status(403).json({
            msg: "User not logged in "
        });
    }
}
module.exports = middleware;
