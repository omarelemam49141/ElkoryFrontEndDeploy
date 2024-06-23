import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopHeaderComponent } from './components/main-components/top-header/top-header.component';
import { NavbarComponent } from './components/main-components/navbar/navbar.component';
import { FooterComponent } from './components/main-components/footer/footer.component';
import { ViewAdminsComponent } from './components/AdminUserManagement/view-admins/view-admins.component';
import { AddAdminComponent } from './components/AdminUserManagement/add-admin/add-admin.component';
import { LoadingService } from './services/loading.service';
import { MainSpinnerComponent } from './components/main-spinner/main-spinner.component';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TopHeaderComponent, NavbarComponent, FooterComponent, 
    ViewAdminsComponent,AddAdminComponent, MainSpinnerComponent, AsyncPipe,
  CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent{
  loading$ = this.loadingService.loading$;
  loading = false;

  constructor(private loadingService: LoadingService, private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.loading$.subscribe(isLoading => {
      this.loading = isLoading;
      this.cdr.detectChanges(); // Manually trigger change detection
    });
  }
  title = 'ElkoryEcommerce';
}
