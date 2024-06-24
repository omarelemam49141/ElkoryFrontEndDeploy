
import { finalize } from 'rxjs/operators';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from '../services/loading.service';

export const loadinPageInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
    loadingService.show()
    return next(req).pipe(
      finalize(() => {
        loadingService.hide();
      })
    );
};
