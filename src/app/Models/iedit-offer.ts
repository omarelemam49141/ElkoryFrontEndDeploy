export interface IEditOffer {
    offerId: number
    title: string
    description: string
    offerDate: {
        year: number
        month: number
        day: number
        dayOfWeek: number
    }
    duration: number
    image: string
    packageDiscount: number
}