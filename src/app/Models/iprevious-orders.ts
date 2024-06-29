import { IOrderProduct } from "./iorder-product";
import { IOrderUser } from "./iorder-user";
import { IProduct } from "./iproduct";

export interface IPreviousOrders {
    orderId: string;
    governerate: string;
    city: string;
    street: string;
    postalCode: string;
    arrivalDate: Date;
    userId: number;
    user: IOrderUser;
    status: number;
    productOrders: IOrderProduct[];
    offerId: number;
    responseDate: Date;
    totalPrice: number;
    totalAmount: number;
    paymentMethod: number;
}
