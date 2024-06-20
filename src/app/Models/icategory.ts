import { ISubCategory } from "./isub-category";

export interface ICategory {
    categoryId: number;
    name: string;
    subCategories: ISubCategory[];
}