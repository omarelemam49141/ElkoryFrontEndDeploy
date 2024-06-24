import { Routes } from "@angular/router";
import { AddNewOfferComponent } from "./add-new-offer/add-new-offer.component";
import { ShowAllOffersComponent } from "./show-all-offers/show-all-offers.component";
import { OfferDetailsComponent } from "./offer-details/offer-details.component";

export const routes: Routes = [ 
    {path: "", redirectTo: "/admin-offers/show-all-offers", pathMatch: "full"},
    {path: "add-offer", component: AddNewOfferComponent},
    {path: "edit-offer/:id", component: AddNewOfferComponent},
    {path: "show-all-offers", component: ShowAllOffersComponent},
    {path: "offer-details/:id", component: OfferDetailsComponent},
]