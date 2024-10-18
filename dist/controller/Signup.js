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
const zod_1 = __importDefault(require("zod"));
require('dotenv').config();
const express = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = express.Router();
const prisma = new client_1.PrismaClient();
const zd = zod_1.default.object({
    name: zod_1.default.string().min(1, { message: "Name should not be empty" }),
    email: zod_1.default.string().email({ message: "Invalid email" }),
    password: zod_1.default.string().min(8, { message: "Invalid password" })
});
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const JWT_PASSWORD = process.env.JWT_PASSWORD;
    const result = zd.safeParse(req.body);
    if (!JWT_PASSWORD) {
        return res.status(400).json({
            msg: "JWT password is not provided "
        });
    }
    if (!result.success) {
        console.log(result.error.errors[0].message);
        return res.status(400).json({
            message: result.error.errors[0].message,
        });
    }
    const { email, password, name } = req.body;
    const exist = yield prisma.user.findFirst({
        where: {
            email: email
        }
    });
    //    console.log(exist);
    if (exist) {
        return res.status(400).json({
            msg: "Email id already exists "
        });
    }
    try {
        const userCreate = yield prisma.user.create({
            data: {
                name: name,
                email: email,
                password: password
            }
        });
        const userId = userCreate.id;
        const token = jsonwebtoken_1.default.sign(userId, JWT_PASSWORD);
        //    console.log("User created succesfuully",userCreate);
        //    console.log("this is token ", token);
        return res.status(201).json({
            msg: "Signed up successfully ",
            token: token
        });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({
            msg: "Internal Server Error "
        });
    }
}));
module.exports = router;
