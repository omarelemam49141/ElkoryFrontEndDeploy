
import { IProductImage } from "./iproduct-image";
import { IProductSubCategoryValues } from "./iproduct-sub-category-values";

export interface IProduct {
    productId: number;
    name: string;
    discount: number;
    originalPrice: number;
    amount: number;
    allAmount?: number;
    description: string;
    categoryName: string;
    finalPrice: number;
    categoryId: number;
    productImages?: IProductImage[];
    categoryValues?: IProductSubCategoryValues[]
}


export interface IwhishListProduct{
    productImages:IProductImage[];

    originalPrice: number;
    amount:number;
    description:string;
   
  
   
    categoryId: number;
    CategoryName:string;
    finalPrice: number;
}