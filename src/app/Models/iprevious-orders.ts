import { IOrderProduct } from "./iorder-product";
import { IProduct } from "./iproduct";

export interface IPreviousOrders {
    orderId: string;
    governerate: string;
    city: string;
    street: string;
    postalCode: string;
    arrivalDate: Date;
    userId: number;
    status: number;
    productOrders: IOrderProduct[];
    offerId: number;
    responseDate: Date;
    totalPrice: number;
    totalAmount: number;
    paymentMethod: number;
}
