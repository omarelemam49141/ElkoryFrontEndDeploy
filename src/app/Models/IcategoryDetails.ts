import { ISubCategoryDetails } from "./IsubCategoryDetails";

export interface ICategoryDetails {
    categoryId: number;
    name: string;
    subCategories:ISubCategoryDetails[]
    // imageUri: string;
    // imageId:string;
}