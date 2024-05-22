import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Injectable({
  providedIn: 'root'
})

export class PaginatorService extends MatPaginatorIntl{
  override itemsPerPageLabel = 'عدد العناصر في الصفحة:';
  override nextPageLabel = 'الصفحة التالية';
  override previousPageLabel = 'الصفحة السابقة';
  override firstPageLabel = 'الصفحة الأولى';
  override lastPageLabel = 'الصفحة الأخيرة';

  override getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return `0 من ${length}`;
    }
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;
    return `الصفحة ${page + 1} من ${Math.ceil(length / pageSize)}`;
  }
}
