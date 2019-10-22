const express = require("express");
const userController = require("../controllers/userController")
const userRouter = express.Router();
const auth = require("../config/auth");

userRouter.get("/login", auth.guest, userController.showLoginForm);
userRouter.post("/login", auth.guest, express.urlencoded({ extended: true }), userController.login);

userRouter.get("/registration", auth.guest, userController.showRegistrationForm);
userRouter.post("/registration", auth.guest, express.urlencoded({ extended: true }), userController.registration);
userRouter.get("/registration/check", auth.guest, userController.check);

userRouter.get("/logout", auth.isAuth, userController.logout);

userRouter.get("/account", auth.isAuth, userController.account);

module.exports = userRouter;