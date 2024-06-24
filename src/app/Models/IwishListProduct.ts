import { IProductImage } from "./iproduct-image";

export interface IwhishListProduct{
    productId:number;
    name:string;
    ProductImages:IProductImage[];

    originalPrice: number;
    amount:number;
    description:string;
   
  
   
    categoryId: number;
    CategoryName:string;
    finalPrice: number;
}