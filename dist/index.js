"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const signup = require('./controller/Signup');
const signin = require("./controller/SignIn");
const getUserSiteName = require('./controller/GetUserSiteName');
const createUserSiteName = require('./controller/CreateUserSiteName');
const deleteUserName = require('./controller/DeleteUserProfileName');
require('dotenv').config();
const app = (0, express_1.default)();
const Port = process.env.Port || 3000;
app.use(express_1.default.json());
app.use('/signup', signup);
app.use('/signin', signin);
app.use('/getUserSiteName', getUserSiteName);
app.use('/createUserName', createUserSiteName);
app.use('/deleteUserName', deleteUserName);
app.listen(Port, () => {
    console.log("Server started on port 3000");
});
