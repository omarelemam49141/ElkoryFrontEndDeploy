import { IOffer } from "./ioffer";
import { IProduct } from "./iproduct";

export interface IReviewOrder {
    applicableOffers: IOffer[];
    userId: number;
    productsAmounts: IProduct[];
    finalPrice: number;
    numberOfUniqueProducts: number;
    numberOfProducts: number;
    offerId?: number;
    finalPriceAfterOffer?: number;
}
