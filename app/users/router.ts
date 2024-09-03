import express, { Router } from "express";
import { createUser, localStrategy, login, loginGoogle, logout, me } from "./controller";
import passport from 'passport';
import * as passportLocal from 'passport-local';
const LocalStrategy = passportLocal.Strategy;


const router: Router = express.Router();

passport.use(new LocalStrategy({ usernameField: "email" }, localStrategy));

router.post('/register', createUser);
router.post('/login', login)
router.post('/signin', loginGoogle);
router.post('/logout', logout);
router.get('/me', me);

export default router;