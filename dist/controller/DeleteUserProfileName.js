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
const console_1 = require("console");
const express_1 = __importDefault(require("express"));
const middleware = require('../middleware');
const route = express_1.default.Router();
const prisma = new client_1.PrismaClient();
route.delete("/", middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { profileName, siteName } = req.body;
    try {
        const findd = yield prisma.userName.findFirst({
            where: {
                profileName: profileName,
                siteName: siteName
            }
        });
        if (!findd) {
            return res.status(400).json({
                msg: "Profile not exist ",
                error: console_1.error
            });
        }
        console.log("This is details of user ", findd);
        const deleted = yield prisma.userName.delete({
            where: {
                id: findd.id,
                authorId: findd.authorId
            }
        });
        res.status(200).json({
            msg: "Profile name deleted"
        });
        console.log(deleted);
    }
    catch (error) {
        return res.status(400).json({
            msg: "Internal server error ",
            error
        });
    }
}));
module.exports = route;
