"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSelectedView = exports.getToken = void 0;
exports.isValidEmail = isValidEmail;
const date_fns_1 = require("date-fns");
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
const getToken = (req) => {
    return req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
};
exports.getToken = getToken;
const getSelectedView = (periode) => {
    const lastPeriode = (() => {
        let start, end;
        switch (periode) {
            case 'Day': {
                start = (0, date_fns_1.startOfDay)((0, date_fns_1.sub)(new Date(), { days: 1 }));
                end = (0, date_fns_1.endOfDay)((0, date_fns_1.sub)(new Date(), { days: 1 }));
                return { start, end };
            }
            case 'Month': {
                start = (0, date_fns_1.startOfMonth)((0, date_fns_1.sub)(new Date(), { months: 1 }));
                end = (0, date_fns_1.endOfMonth)((0, date_fns_1.sub)(new Date(), { months: 1 }));
                return { start, end };
            }
            case 'Year': {
                start = (0, date_fns_1.startOfYear)((0, date_fns_1.sub)(new Date(), { years: 1 }));
                end = (0, date_fns_1.endOfYear)((0, date_fns_1.sub)(new Date(), { years: 1 }));
                return { start, end };
            }
            case 'Week': {
                start = (0, date_fns_1.startOfWeek)((0, date_fns_1.sub)(new Date(), { weeks: 1 }));
                end = (0, date_fns_1.endOfWeek)((0, date_fns_1.sub)(new Date(), { weeks: 1 }));
                return { start, end };
            }
        }
        return { start, end };
    });
    const currentPeriode = (() => {
        let start, end;
        switch (periode) {
            case 'Day': {
                start = (0, date_fns_1.startOfDay)(new Date());
                end = (0, date_fns_1.endOfDay)(new Date());
                return { start, end };
            }
            case 'Month': {
                start = (0, date_fns_1.startOfMonth)(new Date());
                end = (0, date_fns_1.endOfMonth)(new Date());
                return { start, end };
            }
            case 'Year': {
                start = (0, date_fns_1.startOfYear)(new Date());
                end = (0, date_fns_1.endOfYear)(new Date());
                return { start, end };
            }
            case 'Week': {
                start = (0, date_fns_1.startOfWeek)(new Date());
                end = (0, date_fns_1.endOfWeek)(new Date());
                return { start, end };
            }
        }
        return { start, end };
    });
    return { lastPeriode, currentPeriode };
};
exports.getSelectedView = getSelectedView;
