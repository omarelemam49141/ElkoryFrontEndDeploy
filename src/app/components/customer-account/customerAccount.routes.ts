import { Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { ForgetPasswordComponent } from "./forget-password/forget-password.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { ViewProfileComponent } from "./view-profile/view-profile.component";
import { EditProfileComponent } from "./edit-profile/edit-profile.component";
import { VerifyEmailComponent } from "./verify-email/verify-email.component";
import { ForgetPasswordResetPasswordComponent } from "./forget-password-reset-password/forget-password-reset-password.component";

export const routes: Routes = [
    {path: "", redirectTo: "/customer-account/register", pathMatch: "full"},
    {path: "login", component: LoginComponent},
    {path: "register", component: SignupComponent},
    {path: "forgot-password", component: ForgetPasswordComponent},
    {path: "forget-password-reset-password", component: ForgetPasswordResetPasswordComponent},
    {path: "reset-password", component: ResetPasswordComponent},
    {path: "view-profile", component: ViewProfileComponent},
    {path: "edit-profile", component: EditProfileComponent},
    {path: "verify-email", component: VerifyEmailComponent}
]