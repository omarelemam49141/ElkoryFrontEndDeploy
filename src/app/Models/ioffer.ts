import { IOfferProduct } from "./ioffer-product";

export interface IOffer {
    offerId: number;
    title: string;
    image: string;
    description: string;
    offerDate: Date;
    duration: number;
    packageDiscount: number;
    productOffers: IOfferProduct[];
}
