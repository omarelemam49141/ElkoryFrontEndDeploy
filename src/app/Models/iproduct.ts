
import { IProductImage } from "./iproduct-image";

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