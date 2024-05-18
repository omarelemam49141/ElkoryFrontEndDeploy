import { Routes } from "@angular/router";
import { ShowWebsiteInfoComponent } from "./show-website-info/show-website-info.component";
import { EditWebsiteInfoComponent } from "./edit-website-info/edit-website-info.component";

export const routes: Routes = [
    {path: "show-website-info", component: ShowWebsiteInfoComponent},
    {path: "edit-website-info", component: EditWebsiteInfoComponent}
]