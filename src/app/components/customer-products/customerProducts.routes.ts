import { Routes } from "@angular/router";
import { ProductsOrderComponent } from "./products-order/products-order.component";
import { ProductsCartComponent } from "./products-cart/products-cart.component";
import { ProductsWishListComponent } from "./products-wish-list/products-wish-list.component";
import { ProductsListComponent } from "./products-list/products-list.component";
import { ProductDetailsComponent } from "./product-details/product-details.component";

export const routes: Routes = [
    {path: "product-details/:id", component: ProductDetailsComponent},
    {path: "products-list", component: ProductsListComponent},
    {path: "products-wish-list", component: ProductsWishListComponent},
    {path: "products-cart", component: ProductsCartComponent},
    {path: "products-checkout", component: ProductsOrderComponent},
]