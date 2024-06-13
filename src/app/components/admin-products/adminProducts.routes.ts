import { Routes } from "@angular/router";
import { AdminProductsListComponent } from "./admin-products-list/admin-products-list.component";
import { AdminAddProductComponent } from "./admin-add-product/admin-add-product.component";
import { AdminDeleteProductComponent } from "./admin-delete-product/admin-delete-product.component";

export const routes: Routes = [
    {path: "", redirectTo: "/admin-products/admin-products-list", pathMatch: "full"},
    {path: "admin-products-list", component: AdminProductsListComponent},
    {path: "admin-add-product", component: AdminAddProductComponent},
    {path: "admin-edit-product/:id", component: AdminAddProductComponent},
    {path: "admin-delete-product/:id", component: AdminDeleteProductComponent},
]