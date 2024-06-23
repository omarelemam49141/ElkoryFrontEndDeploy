import { IProduct } from "./iproduct";

export interface ICart {
    userId: number;
    productsAmounts: IProduct[];
    finalPrice: number;
    numberOfUniqueProducts: number;
    numberOfProducts: number;
}