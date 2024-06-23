export interface IAddOffer {
    title: string;
    description: string;
    offerDate:{
        year: number;
        month: number;
        day: number;
        dayOfWeek: number
    };
    duration: number;
    packageDiscount: number;
    image:string;
}
