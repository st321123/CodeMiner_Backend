"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
require('dotenv').config();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express = require('express');
const zod = require('zod');
const prisma = new client_1.PrismaClient();
const app = express();
const route = express.Router();
const sign = zod.object({
    email: zod.string().email({ msg: "Invalid email" }),
    password: zod.string().min(8, { msg: "Inavlid password" })
});
route.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const JWT_PASSWORD = process.env.JWT_PASSWORD;
    if (!JWT_PASSWORD) {
        return res.status(500).json({ message: "Internal server error. Missing JWT secret." });
    }
    const validate = sign.safeParse(req.body);
    if (!validate.success) {
        return res.status(400).json({
            msg: validate.error.errors[0].message
        });
    }
    const { email, password } = req.body;
    try {
        const signnedIn = yield prisma.user.findFirst({
            where: {
                email: email,
                password: password
            }
        });
        if (!signnedIn) {
            return res.status(400).json({
                msg: "Invalid id or password"
            });
        }
        const token = jsonwebtoken_1.default.sign(signnedIn.id, JWT_PASSWORD);
        // console.log(token);
        return res.status(200).json({
            msg: "User logged in ",
            token
        });
    }
    catch (error) {
        console.error(error);
        return res.status(400).json({
            msg: "Internal server error",
            error: error
        });
    }
}));
module.exports = route;
