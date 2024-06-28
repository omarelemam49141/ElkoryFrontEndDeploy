export interface ISubCategory {
    subCategoryId: number;
    name: string;
 
        values: {
            value: string;
            imageId: string;
            imageUrl: string;
        }[];
    
}


// export interface ISubCategory {
//     subCategoryId: number;
//     name: string;
//     categories: {
//         categoryId: number;
//         name: string;
//         values: {
//             value: string;
//             imageId: string;
//             imageUrl: string;
//         }[];
//     }[]
// }