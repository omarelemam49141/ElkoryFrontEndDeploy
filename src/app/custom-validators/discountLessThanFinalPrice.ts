import { ValidationErrors, ValidatorFn } from "@angular/forms";

export function discountIsLessThanFinalPrice(): ValidatorFn {
    return (form): ValidationErrors | null => {
        const discount = form.get('discount')?.value;
        const originalPrice = form.get('originalPrice')?.value;

        
        if (discount > originalPrice) {
            return { discountIsLessThanFinalPrice: true };
        }
        return null;
    };
} 