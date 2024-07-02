import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function notMinusOneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    return value == '-1' ? { 'notMinusOne': true } : null;
  };
}