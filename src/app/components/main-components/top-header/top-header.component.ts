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
import { NotifyBellComponent } from "../notify-bell/notify-bell.component";
import { CategoryService } from '../../../services/category.service';
import { ICategoryDetails } from '../../../Models/IcategoryDetails';

@Component({
    selector: 'app-top-header',
    standalone: true,
    templateUrl: './top-header.component.html',
    styleUrls: ['./top-header.component.scss'],
    imports: [CommonModule, FontAwesomeModule, RouterLink, AsyncPipe, SearchProductComponent, NotifyBellComponent]
})
export class TopHeaderComponent implements OnDestroy, OnInit {
  subscriptions: Subscription[] = [];
  webInfo: IWebInfo | undefined;
  isLogged!: boolean;
  cartCount: number = 0;
  activeCategory: string = 'home';
  isCollapsed = true;
  Categories: ICategoryDetails[] = [];


  constructor(library: FaIconLibrary,
     private webInfoService: WebInfoService,
    public accountService: AccountService,
    private router: Router,
    public cartService: CartService,
    private categoryService: CategoryService
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

  
fetchCatogorieswithDetails():void{
  const subscription = this.categoryService.getAllCategory().subscribe({
    next: (categories) => {
      this.Categories = categories;
      console.log('Fetched categories:', this.Categories);
    },
    error: (error: any) => console.error('Error fetching categories', error)
  });
  this.subscriptions.push(subscription);

}
  ngOnInit(): void {
    this.fetchWebInfo();
    this.fetchCatogorieswithDetails();

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

  setActiveCategory(categoryName: string) {
    this.activeCategory = categoryName;
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleDropdown(event: Event): void {
    const target = event.currentTarget as HTMLElement;
    target.classList.toggle("active");

    const dropdownContent = target.nextElementSibling as HTMLElement;
    if (dropdownContent.style.display === "block") {
      dropdownContent.style.display = "none";
    } else {
      dropdownContent.style.display = "block";
    }
  }
  
}
