import { Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { ForgetPasswordComponent } from "./forget-password/forget-password.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { ViewProfileComponent } from "./view-profile/view-profile.component";
import { EditProfileComponent } from "./edit-profile/edit-profile.component";
import { VerifyEmailComponent } from "./verify-email/verify-email.component";
import { ForgetPasswordResetPasswordComponent } from "./forget-password-reset-password/forget-password-reset-password.component";
import { anonymousGuard } from "../../guards/anonymous.guard";
import { authGuard } from "../../guards/auth.guard";

export const routes: Routes = [
    {path: "", redirectTo: "/customer-account/register", pathMatch: "full"},
    {path: "login", component: LoginComponent, canActivate: [anonymousGuard]},
    {path: "register", component: SignupComponent, canActivate: [anonymousGuard]},
    {path: "forgot-password", component: ForgetPasswordComponent, canActivate: [anonymousGuard]},
    {path: "forget-password-reset-password", component: ForgetPasswordResetPasswordComponent, canActivate: [anonymousGuard]},
    {path: "reset-password", component: ResetPasswordComponent, canActivate: [authGuard]},
    {path: "view-profile", component: ViewProfileComponent, canActivate: [authGuard]},
    {path: "edit-profile", component: EditProfileComponent, canActivate: [authGuard]},
    {path: "verify-email", component: VerifyEmailComponent, canActivate: [anonymousGuard]}
]