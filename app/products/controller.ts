import Categories, { Category } from '../categories/model';
import { Request, Response, NextFunction } from "express";
import Products, { Product } from "./model";
import path from 'path';
import fs from 'fs';

interface QueryParams {
    limit?: number;
    skip?: number;
    q?: string;
    category?: string;
}

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {        
        const { limit = 0, skip = 0, q = '', category = '' } = req.query as QueryParams;
        let filter: any = {};

        if (q) {
            filter = {
                ...filter,
                name: { $regex: new RegExp(q, 'i') }
            };
        }

        if (category) {
            const categoryFilter: Category | null = await Categories.findOne({ name: category });
            if (categoryFilter) {
                filter = {
                    ...filter,
                    category: categoryFilter._id
                };
            }
        }

        const count: number = await Products.countDocuments(filter);
        const page: number = count === 0 ? 1 : Math.ceil(count / 12);
        const products: Product[] = await Products.find(filter)
            .limit(Number(limit))
            .skip(Number(skip))
            .populate('category');
        res.status(200).json({ count, page, products });

    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product: Product | null = await Products.findById(req.params.id).populate('category');
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payload = req.body as Product;
        const category: Category | null = await Categories.findOne({ name: payload.category });
        if (!category) {
            res.status(400).json({ message: 'Category not found' });
            return;
        } else {
            if (category) {
                payload.category = category._id as string
            }
        }
        let image_thumbnail: string = '';
        let image_detail: string[] = [];
        if (req.files && typeof req.files === 'object') {
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
            if (files.image_thumbnail && files.image_thumbnail.length > 0) {
                const file = files.image_thumbnail[0];
                const tmp_path = file.path;
                const originalExt = file.originalname.split('.').pop();
                const filename = file.filename + '.' + originalExt;
                const target_path = path.resolve(__dirname, '../../' + `public/images/${filename}`);
                const src = fs.createReadStream(tmp_path);
                const dest = fs.createWriteStream(target_path);
                src.pipe(dest);
                image_thumbnail = `/${filename}`;
                src.on('error', () => {
                    if (fs.existsSync(target_path)) {
                        fs.unlinkSync(target_path);
                    }
                    dest.end();
                    res.status(500).json({ message: 'Failed to upload image' });
                });
            }
            if (files.image_detail && files.image_detail.length > 0) {
                files.image_detail.forEach((file) => {
                    const tmp_path = file.path;
                    const originalExt = file.originalname.split('.').pop();
                    const filename = file.filename + '.' + originalExt;
                    const target_path = path.resolve(__dirname, '../../' + `public/images/${filename}`);
                    const src = fs.createReadStream(tmp_path);
                    const dest = fs.createWriteStream(target_path);
                    src.pipe(dest);

                    image_detail.push(`/${filename}`);

                    src.on('error', () => {
                        if (fs.existsSync(target_path)) {
                            fs.unlinkSync(target_path);
                        }
                        dest.end();
                        res.status(500).json({ message: 'Failed to upload image' });
                    });
                });
            }
        }
        const product: Product = new Products({
            ...req.body,
            image_thumbnail,
            image_details: image_detail,
        });
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product: Product | null = await Products.findById(req.params.id);
        if (product) {
            const payload = req.body as Product;
            if (payload.category) {
                const category: Category | null = await Categories.findOne({ name: payload.category });
                if (!category) {
                    res.status(400).json({ message: 'Category not found' });
                    return;
                } else {
                    if (category._id) {
                        payload.category = category._id as string;
                    }
                }
            }
            let image_thumbnail: string = '';
            let image_details: string[] = [];
            if (req.files) {
                const files = req.files as { [fieldname: string]: Express.Multer.File[] };
                // saat update image_thumbnail harus berikan juga req.body.image_thumbnail yang lama                                
                if (files.image_thumbnail && files.image_thumbnail.length > 0) {
                    // ini new imagenya
                    fs.unlinkSync(path.resolve(__dirname, '../../' + `public/images${product.image_thumbnail}`));
                    const file = files.image_thumbnail[0];
                    const tmp_path = file.path;
                    const originalExt = file.originalname.split('.').pop();
                    const filename = file.filename + '.' + originalExt;
                    const target_path = path.resolve(__dirname, '../../' + `public/images/${filename}`);
                    const src = fs.createReadStream(tmp_path);
                    const dest = fs.createWriteStream(target_path);
                    src.pipe(dest);
                    image_thumbnail = `/${filename}`;
                    src.on('error', () => {
                        if (fs.existsSync(target_path)) {
                            fs.unlinkSync(target_path);
                        }
                        dest.end();
                        res.status(500).json({ message: 'Failed to updated image' });
                    });
                }
                // saat update image_detail harus berikan juga req.body.image_details[] yang lama                                

                if (req.body.image_details) {
                    if (req.body.image_details.length > 0) {
                        product.image_details.forEach((image_detail) => {
                            if (!req.body.image_details.includes(image_detail)) {
                                fs.unlinkSync(path.resolve(__dirname, '../../' + `public/images${image_detail}`));
                            } else {
                                image_details.push(image_detail);
                            }
                        });
                    } else {
                        product.image_details.forEach((image_detail) => {
                            fs.unlinkSync(path.resolve(__dirname, '../../' + `public/images${image_detail}`));
                        });
                    }
                }
                if (!req.body.image_details) {
                    product.image_details.forEach((image_detail) => {
                        fs.unlinkSync(path.resolve(__dirname, '../../' + `public/images${image_detail}`));
                    });
                }
                if (files.image_detail && files.image_detail.length > 0) {
                    files.image_detail.forEach((file) => {
                        const tmp_path = file.path;
                        const originalExt = file.originalname.split('.').pop();
                        const filename = file.filename + '.' + originalExt;
                        const target_path = path.resolve(__dirname, '../../' + `public/images/${filename}`);
                        const src = fs.createReadStream(tmp_path);
                        const dest = fs.createWriteStream(target_path);
                        src.pipe(dest);
                        image_details.push(`/${filename}`);
                        src.on('error', () => {
                            if (fs.existsSync(target_path)) {
                                fs.unlinkSync(target_path);
                            }
                            dest.end();
                            res.status(500).json({ message: 'Failed to updated image' });
                        });
                    });
                }
            }
            const updatedProduct: Product | null = await Products.findByIdAndUpdate(req.params.id, {
                ...payload,
                image_thumbnail: image_thumbnail.length > 0 ? image_thumbnail : product.image_thumbnail,
                image_details: image_details.length > 0 ? image_details : product.image_details,
            }, { new: true, runValidators: true });
            res.status(200).json(updatedProduct);
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product: Product | null = await Products.findById(req.params.id);
        if (product) {
            if (product.image_thumbnail) {
                const image_thumbnail = path.resolve(__dirname, '../../' + `public/images/${product.image_thumbnail}`);
                fs.unlinkSync(image_thumbnail);
            }
            if (product.image_details) {
                product.image_details.forEach((image_detail) => {
                    const image = path.resolve(__dirname, '../../' + `public/images/${image_detail}`);
                    fs.unlinkSync(image);
                });
            }
            await Products.findByIdAndDelete(req.params.id);
            res.status(204).json();
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

