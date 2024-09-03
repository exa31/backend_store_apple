import { Response, Request, NextFunction } from "express";
import Users, { User } from "./model";
import bcrypt from 'bcrypt';
import { getToken, isValidEmail } from "../../utils";
import passport from 'passport';
import jwt from 'jsonwebtoken';
import Carts, { Cart } from "../cart/model";


export const localStrategy = async (email: string, password: string, done: any) => {
    const inputPw: string = password;
    try {
        const user: User | null = await Users.findOne({ email: email }).select('-token -createdAt -updatedAt -address -phone_number -__v +password +name')
        if (!user) {
            return done(null, false, { message: 'Invalid email or password' });
        }
        const isPasswordValid: boolean = await bcrypt.compare(inputPw, user.password);
        if (!isPasswordValid) {
            return done(null, false, { message: 'Invalid email or password' });
        }
        const { password, ...userWhithOutPassword }: { password: string, userWhithOutPassword: User } = user.toJSON();
        return done(null, userWhithOutPassword);
    } catch (error) {
        return done(error);
    }
}

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        req.body.password = await bcrypt.hash(req.body.password, 10);
        if (!isValidEmail(req.body.email)) {
            throw new Error('Invalid email');
        }
        const { password, name, email } = req.body;
        const cart: Cart = new Carts()
        const user: User = new Users({ password, name, email });
        user.cart = cart._id;
        cart.user = user._id;
        await user.save();
        await cart.save();
        res.status(201).json(user);
    } catch (error) {
        if ((error as Error).name === 'MongoServerError' && (error as Error).message.includes('duplicate key error')) {
            console.log((error as Error).name);
            return res.status(400).json({ message: 'Email already exists' });
        }

        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', async (err: any, user: User) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign(user, process.env.SECRET_JWT_KEY as string, { expiresIn: '30d', algorithm: 'HS384' });
        try {
            await Users.findByIdAndUpdate({ _id: user._id }, { $push: { token: token } });
            res.status(200).json({ token });
        } catch (error) {
            next(error);
        }
    })(req, res, next);
};

export const loginGoogle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body as { email: string };
        const user: User | null = await Users.findOne({ email: email }).select('-token -createdAt -updatedAt -address -phone_number -__v -password -likes -cart');
        if (!user) {
            res.status(401).json({ message: 'Unauthorized' });
        } else {
            const payload = { id: user._id, email: user.email, name: user.name, role: user.role };
            const token = jwt.sign(payload, process.env.SECRET_JWT_KEY as string, { expiresIn: '30d', algorithm: 'HS384' });
            await Users.findByIdAndUpdate({ _id: user._id }, { $push: { token: token } });
            res.status(200).json({ token, name: user.name });
        }
    } catch (error) {
        next(error);
    }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = getToken(req);
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const user: User | null = await Users.findOneAndUpdate({ token: token }, { $pull: { token: token } });
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        res.status(200).json({ message: 'Logout success' });
    } catch (error) {
        next(error);
    }
};

export const me = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'token expired', status: 401 });
        }
        return res.status(200).json({ user: req.user, status: 200 });
    } catch (error) {
        return next(error);
    }
}