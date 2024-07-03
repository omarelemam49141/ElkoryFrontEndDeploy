import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faBars, faChevronDown, faUserTie, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { IWebInfo } from '../../../Models/IwebsiteInfo';
import { WebInfoService } from '../../../services/WebInfo.service';
import { Router, RouterLink } from '@angular/router';
import { AccountService } from '../../../services/account.service';
import { SearchProductComponent } from '../search-product/search-product.component';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-top-header',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, RouterLink, AsyncPipe, SearchProductComponent],
  templateUrl: './top-header.component.html',
  styleUrls: ['./top-header.component.scss']
})
export class TopHeaderComponent implements OnDestroy, OnInit {
  subscriptions: Subscription[] = [];
  webInfo: IWebInfo | undefined;
  isLogged!: boolean;
  cartCount: number = 0;


  constructor(library: FaIconLibrary,
     private webInfoService: WebInfoService,
    public accountService: AccountService,
    private router: Router,
    public cartService: CartService
  ) {
    library.addIcons(faBars, faChevronDown, faUserTie, faShoppingCart);
  }

  /**
   * Fetches website information from a service and assigns it to the webInfo property of the TopHeaderComponent class.
   * Manages the subscription to ensure proper cleanup.
   */
  fetchWebInfo(): void {
    const subscription = this.webInfoService.getWebInfo().subscribe({
      next: (webInfo: IWebInfo) => {
        this.webInfo = webInfo;
        // console.log('Assigned webInfo:', this.webInfo);
      },
      error: (error: any) => {
         console.error('Error fetching web info', error);
      }
    });
    this.subscriptions.push(subscription);
  }

  ngOnInit(): void {
    this.fetchWebInfo();
    this.accountService.loggedInSubject.subscribe({
      next: (data) => {
        
        this.isLogged = data; 
      }
    })
    // if(localStorage.getItem("token")){
    //   this.isLogged = true;
    // }
    //     this.cartService.cartCount$.subscribe(count => {

    //       this.cartCount = count;
    //     });
    
    //     // Load initial cart count
    //     this.cartService.loadCartCount();
  }

  logOut() {
    this.accountService.logout();
    this.cartService.changeNumberOfItemsInCart(0)
  }

  goToPreviousOrders() {
    this.router.navigate(['/customer-products/customer-previous-orders', this.accountService.getTokenId()]);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
