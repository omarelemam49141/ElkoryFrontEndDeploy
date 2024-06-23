import { Routes } from "@angular/router";
import { AddAdminComponent } from "./add-admin/add-admin.component";
import { ViewUsersComponent } from "./view-users/view-users.component";
import { ViewAdminsComponent } from "./view-admins/view-admins.component";

export const routes: Routes = [
    // {path: "view-users", component: ViewUsersComponent},
    // {path: "view-admins", component: ViewAdminsComponent},
    // {path: "add-admin", component: AddAdminComponent}

    {path: "", redirectTo: "/AdminUserManagement/admin-view-admins", pathMatch: "full"},
    {path: "admin-view-users", component: ViewUsersComponent},
    {path: "admin-view-admins", component: ViewAdminsComponent},
    {path: "app-add-admin", component: AddAdminComponent}
]


