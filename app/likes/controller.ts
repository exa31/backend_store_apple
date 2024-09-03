import { Request, Response, NextFunction } from "express";
import Users, { User } from "../users/model";
import Products, { Product } from "../products/model";

interface ReqUser {
    productId: string;
}

export const getLikes = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const user: User | null = await Users.findById(req.user.id).populate('likes');
        if (user) {
            return res.status(200).json(user.likes);
        }
        return res.status(404).json({ message: 'Wishlist not found' });
    } catch (error) {
        next(error);
    }
};

export const Likes = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const user: User | null = await Users.findById(req.user.id);
        if (user) {
            const product: Product | null = await Products.findById(req.body.productId);
            const isLiked = user.likes!.find(like => like.toString() === req.body.productId);
            if (isLiked) {
                user.likes = user.likes!.filter(like => like.toString() !== req.body.productId);
                await user.save();
                return res.status(200).json({ message: 'Product removed from wishlist' });
            } else if (!isLiked && product) {
                user.likes!.push(product._id.toString())
                await user.save();
                return res.status(201).json({ message: 'Product added to wishlist' });
            }
            return res.status(404).json({ message: 'Product not found' });
        }
        return res.status(404).json({ message: 'User not found' });
    } catch (error) {
        console.log(error);
        next(error);
    }
};