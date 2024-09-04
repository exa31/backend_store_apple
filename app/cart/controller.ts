import Carts, { Cart } from "./model";
import { Request, Response, NextFunction } from "express";

interface ReqUser {
    productId: string;
    quantity: number;
}

export const getCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const cart: Cart | null = await Carts.findOne({ user: req.user._id }).populate('products.product');
        if (cart) {
            return res.status(200).json(cart);
        }
        return res.status(404).json({ message: 'Cart not found' });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const addProductToCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { productId, quantity } = req.body as ReqUser;
        const cart: Cart | null = await Carts.findOne({ user: req.user._id });
        if (cart) {
            const exisProduct = cart.products.find(product => product.product.toString() === productId);
            if (exisProduct) {
                exisProduct.quantity += quantity;
                await cart.save();
                return res.status(200).json({ message: 'Product added to cart', cart });
            } else {
                cart.products.push({ product: productId, quantity });
                await cart.save();
                return res.status(200).json({ message: 'Product added to cart', cart });
            }
        }
        return res.status(404).json({ message: 'Cart not found' });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const reduceProductCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { productId } = req.body as ReqUser;
        const cart: Cart | null = await Carts.findOne({ user: req.user._id });
        if (cart) {
            const exisProduct = cart.products.find(product => product.product.toString() === productId);
            if (exisProduct) {
                if (exisProduct.quantity === 1) {
                    const cart: Cart | null = await Carts.findOneAndUpdate({ user: req.user._id }, { $pull: { products: { product: productId } } }, { new: true });
                    return res.status(200).json({ message: 'Product removed from cart', cart });
                } else {
                    exisProduct.quantity -= 1;
                    await cart.save();
                    return res.status(200).json({ message: 'Product reduced from cart', cart });
                }
            }
        }
        return res.status(404).json({ message: 'Cart not found' });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const removeProductFromCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { productId } = req.body as ReqUser
        const cart: Cart | null = await Carts.findOneAndUpdate({ user: req.user._id }, { $pull: { products: { product: productId } } }, { new: true });
        if (cart) {
            return res.status(200).json({ message: 'Product removed from cart', cart });
        }
        return res.status(404).json({ message: 'Cart not found' });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

