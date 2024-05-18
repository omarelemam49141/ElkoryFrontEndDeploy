import { Routes } from "@angular/router";
import { ShowOrderDetailsComponent } from "./show-order-details/show-order-details.component";
import { ShowOrdersComponent } from "./show-orders/show-orders.component";

export const routes: Routes = [
    {path: "show-orders", component: ShowOrdersComponent},
    {path: "show-order-details/:id", component: ShowOrderDetailsComponent},
]