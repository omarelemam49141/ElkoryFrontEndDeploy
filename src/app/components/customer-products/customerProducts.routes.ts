import { Routes } from "@angular/router";
import { ProductsOrderComponent } from "./products-order/products-order.component";
import { ProductsCartComponent } from "./products-cart/products-cart.component";
import { ProductsWishListComponent } from "./products-wish-list/products-wish-list.component";
import { ProductsListComponent } from "./products-list/products-list.component";
import { ProductDetailsComponent } from "./product-details/product-details.component";
import { ConfirmOrderComponent } from "./confirm-order/confirm-order.component";
import { CustomerPreviousOrdersComponent } from "./customer-previous-orders/customer-previous-orders.component";

export const routes: Routes = [
    {path: "", redirectTo: "/customer-products/products-list", pathMatch: "full"},
    {path: "product-details/:id", component: ProductDetailsComponent},
    {path: "products-list", component: ProductsListComponent},
    {path: "products-wish-list", component: ProductsWishListComponent},
    {path: "products-cart", component: ProductsCartComponent},
    {path: "products-checkout", component: ProductsOrderComponent},
    {path: "confirm-order", component: ConfirmOrderComponent},
    {path: "customer-previous-orders/:id", component: CustomerPreviousOrdersComponent},
]