import { ValidatorFn, AbstractControl, ValidationErrors, FormArray } from '@angular/forms';

export const oneImageAtLeast: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const formArray = control as FormArray;
    if (formArray.length < 1 || !formArray.at(0).value) {
        return { 'oneImageAtLeast': true };
    }
    return null;
};