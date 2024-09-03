import Categories, { Category } from './model';
import type { Request, Response, NextFunction } from 'express';


export const getCategories = async (req:Request, res: Response, next: NextFunction) => {
    try {
        const categories : Category[] = await Categories.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getCategory = async (req:Request, res: Response, next: NextFunction) => {
    try {
        const category: Category|null = await Categories.findById(req.params.id);
        if (!category) {
            res.status(404).json({ message: 'Category not found' });
            return;
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const createCategory = async (req:Request, res: Response, next: NextFunction) => {
    try {
        const name : string = req.body.name;
        const category : Category  = new Categories({ name });
        const newCategory : Category = await category.save();
        res.status(201).json(newCategory);
    } catch (error) {
        if ((error as Error).name === 'ValidationError') {
            res.status(400).json({ message: (error as Error).message });
        }
        res.status(500).json({ message: (error as Error).message });
    }
};

export const updateCategory = async (req:Request, res: Response, next: NextFunction) => {
    try {
        const name : string = req.body.name;
        const id : string = req.params.id;
        const category : Category|null = await Categories.findById(id);
        if (category) {
            category.name = name;
            const updatedCategory = await category.save();
            res.status(200).json(updatedCategory);
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
        if ((error as Error).name === 'ValidationError') {
            res.status(400).json({ message: (error as Error).message });
        }
        res.status(500).json({ message: (error as Error).message });
    }
};

export const deleteCategory = async (req:Request, res: Response, next: NextFunction) => {
    try {
        const id : string = req.params.id;
        const category: Category|null = await Categories.findById(id);
        if (category) {
            await Categories.deleteOne({ _id: id });
            res.status(200).json({ message: 'Category deleted' });
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};