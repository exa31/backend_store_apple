import { NextFunction, Response, Request } from "express";
import Orders, { type Order } from "../orders/model";
import Users from "../users/model";
import { getSelectedView } from "../../utils";
import Products from "../products/model";

export const getDataDashboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const date = ["Month", "Year"];
        const { type = "Year" } = req.query;
        if (req.user.role !== 'admin') {
            res.status(403).json({ message: "Forbidden access" });
        }
        if (!type) {
            res.status(400).json({ message: "Invalid date type" });
        }
        if (type && !date.includes(type as string)) {
            res.status(400).json({ message: "Invalid date type" });
        }
        const { currentPeriode } = getSelectedView(type as string);
        const result = await Orders.aggregate([
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
        const totalProducts: number = await Products.countDocuments();
        const totalUsers: number = await Users.countDocuments();
        const totalOrders: Order[] | number = await Orders.countDocuments({ status_payment: 'completed' }).sort({ createdAt: -1 }).gte("createdAt", currentPeriode().start).lte("createdAt", currentPeriode().end);
        res.status(200).json({ totalProducts, resultTotal, totalOrders, totalUsers, dataChart: fullYearResult });
    } catch (error) {
        next(error);
    }
};