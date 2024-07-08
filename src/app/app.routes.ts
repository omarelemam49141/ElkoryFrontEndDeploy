import { Routes } from '@angular/router';
import { HomeComponent } from './components/main-components/home/home.component';
import { TopHeaderComponent } from './components/main-components/top-header/top-header.component';
import { NavbarComponent } from './components/main-components/navbar/navbar.component';
import { NotFoundComponent } from './components/main-components/not-found/not-found.component';
import { adminAuthGuard } from './guards/admin-auth.guard';
import { CategoryDetailsComponent } from './components/customer-categories/category-details/category-details.component';
import { ProductsListComponent } from './components/customer-products/products-list/products-list.component';

export const routes: Routes = [
    {path: "", redirectTo: "/home", pathMatch: "full"},
    {path: "home", component: HomeComponent},
    {path:"categoryDetails/:categoryId", component: CategoryDetailsComponent},
    {path:"Subcategory-value-products/:categoryID/:subCategoryID/:value",component:ProductsListComponent},
    {path: "top-header", component: TopHeaderComponent},
    {path: "navbar",component: NavbarComponent},
    {path: "admin-offers", loadChildren:()=>import('./components/admin-offers/adminOffers.routes').then(m=>m.routes)}, //canActivate: [adminAuthGuard]},
    {path: "admin-orders", loadChildren:()=>import('./components/admin-orders/adminOrders.routes').then(m=>m.routes)}, //canActivate: [adminAuthGuard]},
    {path: "admin-products", loadChildren:()=>import('./components/admin-products/adminProducts.routes').then(m=>m.routes)}, //canActivate: [adminAuthGuard]},
    {path: "admin-user-management", loadChildren:()=>import('./components/AdminUserManagement/adminUserManagement.routes').then(m=>m.routes)}, //canActivate: [adminAuthGuard]},
    {path: "customer-account", loadChildren:()=>import('./components/customer-account/customerAccount.routes').then(m=>m.routes)},
    {path: "customer-products", loadChildren:()=>import('./components/customer-products/customerProducts.routes').then(m=>m.routes)},
    {path: "website-info", loadChildren:()=>import('./components/website-info/websiteInfo.routes').then(m=>m.routes)},
    {path: "admin-categories", loadChildren:()=>import('./components/admin-categories/adminCategories.routes').then(m=>m.routes)}, //canActivate: [adminAuthGuard]},
    {path: "**", component: NotFoundComponent}
];
