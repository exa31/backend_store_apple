import jwt from 'jsonwebtoken';
import Users, { User } from './../app/users/model';
import { NextFunction, Request, Response } from "express";
import { getToken } from "../utils";

export const decodeToken = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = getToken(req);
            if (!token) {
                return next()
            }
            if (token) {
                const user: User | null = await Users.findOne({ token: { $in: [token] } });
                if (!user) {
                    return next()
                }
                jwt.verify(token, process.env.SECRET_JWT_KEY as string, { algorithms: ['HS384'] }, (err, decoded) => {
                    if (err) {
                        return next()
                    }
                    req.user = decoded as { id: string; name: string; email: string; role: string; };

                    return next();
                });
            }
        } catch (error) {
            return next(error)
        }
    }
}



export const checkRole = (role: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (req.user) {
            if (req.user.role === role) {
                return next();
            }
        }
        return res.status(403).json({ message: 'Forbidden' });
    }
}

export const checkIsUserData = (_id: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (req.user) {
            if (req.user.id === _id) {
                return next();
            }
        }
        return res.status(403).json({ message: 'Forbidden' });
    }
};