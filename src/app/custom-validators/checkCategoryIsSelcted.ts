import { ValidationErrors, ValidatorFn } from "@angular/forms";

export const CheckCategoryIsSelected: ValidatorFn = 
    (control): null | ValidationErrors => {
        if (control.value == -1) {
            return { "categoryNotSelected": true };
        }
        return null;
} 