import express, { Request, Response } from 'express';
const signup = require('./controller/Signup');
const signin = require("./controller/SignIn");
const getUserSiteName = require('./controller/GetUserSiteName');
const createUserSiteName = require('./controller/CreateUserSiteName');
const deleteUserName = require('./controller/DeleteUserProfileName');
require('dotenv').config();
const app = express();
const Port = process.env.Port || 3000;
app.use(cors());

app.use(express.json());

app.use('/signup',signup);
app.use('/signin',signin);
app.use('/getUserSiteName',getUserSiteName);
app.use('/createUserName',createUserSiteName);
app.use('/deleteUserName', deleteUserName);

app.get("/", (req,res)=>{
    res.send("THIS IS HOMe Pgaeg");
});

app.listen(PORT, () => {
    console.log("Server started on port 3000");
});
