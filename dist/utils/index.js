"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getToken = void 0;
exports.isValidEmail = isValidEmail;
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
const getToken = (req) => {
    return req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
};
exports.getToken = getToken;
