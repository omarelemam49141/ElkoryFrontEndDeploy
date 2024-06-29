import { IOrderModel } from "./iorder-model";
import { IPreviousOrders } from "./iprevious-orders";

export interface IOrdersPaginated {
    items: IPreviousOrders[];
    pageNumber: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}