import { checkIsUserData } from "../../middleware";
import DeliveryAddresses, { DeliveryAddress } from "./model";
import { Request, Response, NextFunction } from "express";

export const getDeliveryAddresses = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deliveryAddresses: DeliveryAddress[] = await DeliveryAddresses.find({ user: req.user.id });
        if (deliveryAddresses.length > 0) {
            checkIsUserData(deliveryAddresses[0].user.toString()!);
            return res.status(200).json(deliveryAddresses);
        }
        return res.status(404).json({ message: 'Delivery Address not found', status: 404 });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const getDeliveryAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deliveryAddress: DeliveryAddress | null = await DeliveryAddresses.findOne({ _id: req.params.id, user: req.user.id });
        if (deliveryAddress) {
            checkIsUserData(deliveryAddress?.user.toString()!);
            return res.status(200).json(deliveryAddress);
        }
        return res.status(404).json({ message: 'Delivery Address not found' });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

export const createDeliveryAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payload = { ...req.body, user: req.user.id };
        const deliveryAddress: DeliveryAddress = await DeliveryAddresses.create(payload);
        return res.status(201).json(deliveryAddress);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const updateDeliveryAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deliveryAddress: DeliveryAddress | null = await DeliveryAddresses.findOne({ _id: req.params.id, user: req.user.id });
        if (deliveryAddress) {
            checkIsUserData(deliveryAddress?.user.toString()!)
            await DeliveryAddresses.updateOne({ _id: req.params.id }, { $set: req.body });
            return res.status(200).json(deliveryAddress);
        }
        return res.status(404).json({ message: 'Delivery Address not found' });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const deleteDeliveryAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deliveryAddress: DeliveryAddress | null = await DeliveryAddresses.findOne({ _id: req.params.id, user: req.user.id });
        if (deliveryAddress) {
            checkIsUserData(deliveryAddress?.user.toString()!)
            await DeliveryAddresses.deleteOne({ _id: req.params.id });
            return res.status(204).json();
        }
        return res.status(404).json({ message: 'Delivery Address not found' });
    } catch (error) {
        console.log(error);
        next(error);
    }
};