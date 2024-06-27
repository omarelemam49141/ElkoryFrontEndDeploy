export interface ICategorySubCategoriesValues {
  categoryId: number;
  name: string;
  subCategories: {
    subCategoryId: number;
    name: string;
    values: {
      value: string;
      imageId: string;
      imageUrl: string;
    }[];
  }[];
}