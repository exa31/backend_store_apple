"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDataDashboard = void 0;
const model_1 = __importDefault(require("../orders/model"));
const model_2 = __importDefault(require("../users/model"));
const utils_1 = require("../../utils");
const model_3 = __importDefault(require("../products/model"));
const getDataDashboard = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const date = ["Month", "Year"];
        const { type = "Year" } = req.query;
        if (req.user.role !== 'admin') {
            res.status(403).json({ message: "Forbidden access" });
        }
        if (!type) {
            res.status(400).json({ message: "Invalid date type" });
        }
        if (type && !date.includes(type)) {
            res.status(400).json({ message: "Invalid date type" });
        }
        const { currentPeriode } = (0, utils_1.getSelectedView)(type);
        const result = yield model_1.default.aggregate([
            { $match: { status_payment: 'completed', createdAt: { $gte: currentPeriode().start, $lte: currentPeriode().end } } },
            { $group: { _id: { $month: "$createdAt" }, total: { $sum: "$total" } } },
            { $sort: { _id: 1 } },
        ]);
        // Ensure all 12 months are included in the result
        const fullYearResult = Array.from({ length: 12 }, (_, i) => {
            const month = i + 1;
            const found = result.find(rs => rs._id === month);
            return found ? found : { _id: month, total: 0 };
        });
        const resultTotal = result.reduce((acc, curr) => acc + curr.total, 0);
        const totalProducts = yield model_3.default.countDocuments();
        const totalUsers = yield model_2.default.countDocuments();
        const totalOrders = yield model_1.default.countDocuments({ status_payment: 'completed' }).sort({ createdAt: -1 }).gte("createdAt", currentPeriode().start).lte("createdAt", currentPeriode().end);
        res.status(200).json({ totalProducts, resultTotal, totalOrders, totalUsers, dataChart: fullYearResult });
    }
    catch (error) {
        next(error);
    }
});
exports.getDataDashboard = getDataDashboard;
