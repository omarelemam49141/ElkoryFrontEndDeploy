import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { WebInfoService } from '../../../services/WebInfo.service';
import { IWebInfo } from '../../../Models/IwebsiteInfo';
import { AccountService } from '../../../services/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent implements OnInit {
  // inject webInfo service
  webInfoService: WebInfoService;
  iwebInfo: IWebInfo = {} as IWebInfo;

  constructor(webInfoService: WebInfoService, 
    private accountService: AccountService,
  private router: Router) {
    this.webInfoService = webInfoService;
  }

  ngOnInit(): void {
    this.webInfoService.getWebInfo().subscribe((data) => {
      this.iwebInfo = data;
    });
  }

  getCurrentYear() {
    return new Date().getFullYear();
  }

  goToAccount() {
    if (this.accountService.getTokenId()) {
      this.router.navigate(["/customer-account/view-profile"]);
    } else {
      this.router.navigate(["/customer-account/login"]);
    }
  }

  goToCustomerOrders() {
    if (this.accountService.getTokenId()) {
      this.router.navigate(["/customer-products/customer-previous-orders"]);
    } else {
      this.router.navigate(["/customer-account/login"]);
    }
  }

  goToWishlist() {
    if (this.accountService.getTokenId()) {
      // this.router.navigate(["/customer-products/customer-previous-orders"]);
    } else {
      this.router.navigate(["/customer-account/login"]);
    }
  }
}
