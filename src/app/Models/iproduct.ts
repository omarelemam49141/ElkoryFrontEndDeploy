import { IImage_product } from "./iImage_product";

export interface IProduct {
    productId: number;
    name: string;
productImages:IImage_product[];
    discount: number;
    originalPrice: number;
    amount: number;
    description: string;
    categoryName: string;
    finalPrice: number;
    categoryId: number;
}