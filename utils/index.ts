import { Request } from 'express';

export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export const getToken = (req: Request) => {
    return req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
}