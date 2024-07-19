import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Pipe({
  name: 'egyptianCurrency',
  standalone: true

})
export class EgyptianCurrencyPipe implements PipeTransform {

  constructor(private currencyPipe: CurrencyPipe) {}

  transform(
    value: any,
    currencyCode: string = 'EGP',
    display: 'symbol' | 'code' | 'symbol-narrow' | boolean = 'symbol',
    digitsInfo?: string,
    locale?: string
  ): string | null| undefined{
    if (currencyCode.toUpperCase() === 'EGP') {
      return this.currencyPipe.transform(value, 'EGP', display, digitsInfo, locale)?.replace('EGP', 'جنية');
    }
    return this.currencyPipe.transform(value, currencyCode, display, digitsInfo, locale);
  }
}

