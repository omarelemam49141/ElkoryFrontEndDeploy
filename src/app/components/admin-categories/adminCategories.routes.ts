import { Routes } from "@angular/router";
import { CategoriesListComponent } from "./categories-list/categories-list.component";
import { AddCategoryComponent } from "./add-category/add-category.component";
import { DeleteCategoryComponent } from "./delete-category/delete-category.component";
import { CategoryDetailsComponent } from "./category-details/category-details.component";
import { SubcategoriesListComponent } from "./subcategories-list/subcategories-list.component";
import { AddSubcategoryComponent } from "./add-subcategory/add-subcategory.component";
import { DeleteSubcategoryComponent } from "./delete-subcategory/delete-subcategory.component";
import { SubCategoryDetailsComponent } from "./sub-category-details/sub-category-details.component";

export const routes: Routes = [
    {path: "", redirectTo: "/admin-categories/categories-list", pathMatch: "full"},
    {path: "categories-list", component: CategoriesListComponent},
    {path: "add-category", component: AddCategoryComponent},
    {path: "categories-list/:id", component: CategoriesListComponent},
    {path: "edit-category/:id", component: AddCategoryComponent},
    {path: "delete-category/:id", component: DeleteCategoryComponent},
    {path: "category-details/:id", component: CategoryDetailsComponent},
    {path: "subcategories-list", component: SubcategoriesListComponent},
    {path: "subcategories-list/:id", component: SubcategoriesListComponent},
    {path: "add-subcategory", component: AddSubcategoryComponent},
    {path: "edit-subcategory/:id", component: AddSubcategoryComponent},
    {path: "subcategory-details/:id", component: SubCategoryDetailsComponent},
    {path: "delete-subcategory/:id", component: DeleteSubcategoryComponent}
]