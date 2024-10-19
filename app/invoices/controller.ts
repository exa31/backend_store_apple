import { Request, Response, NextFunction } from "express";
import Invoices, { Invoice } from "./model";
import { checkIsUserData } from "../../middleware";

export const getInvoice = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const invoices: Invoice | null = await Invoices.findOne({ order: req.params.orderId }).populate({
            path: 'user',
            select: '-password -token -createdAt -updatedAt -role -cart -likes -_id -__v'
        }).populate('order');
        checkIsUserData(invoices!.user._id.toString()!);
        res.status(200).json(invoices);
    } catch (error) {
        next((error as Error));
    }
};