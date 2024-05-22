import { IProduct } from './iproduct';

export interface ProductsPagination {
    items: IProduct[];
    totalItems: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    hasPrevious: boolean;
    hasNext: boolean;
}
