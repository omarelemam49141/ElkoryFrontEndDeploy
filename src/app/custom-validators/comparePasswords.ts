import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function comparePasswords(formType: string): ValidatorFn {
    return (control: AbstractControl): null | ValidationErrors => {
        console.log("hello");
        let password;
        if (formType == "resetPassword") {
            password = control.get("newPassword");
        } else if (formType == "signup") {
            password = control.get("password");
        }

        let confirmPassword = control.get("confirmPassword");
    
        if (!password?.value || !confirmPassword?.value) {
            return null;
        }
        
        let validationErrors: ValidationErrors = {"comparePassword": true};
        return password.value != confirmPassword.value ? validationErrors : null
    }
}