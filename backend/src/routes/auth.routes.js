import { Router } from "express";
import { registeruser } from "../controllers/user.controller.js";

const router = Router();

// router.post("api/v1/register", (req, res) => {
//     res.send("register");
// });


router.route("/register").post(registeruser);

export default router;


// auth.routes.js

// import express from 'express';
// import { registerUser, loginUser } from '../controllers/authController.js';

// const router = express.Router();

// router.post('/register', registerUser);
// router.post('/login', loginUser);

// export default router;