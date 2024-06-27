import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { WishListService } from '../../../services/wishList.service';
import { IwhishListProduct } from '../../../Models/IwishListProduct';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { IUser } from '../../../Models/iuser';

@Component({
  selector: 'app-products-wish-list',
  standalone: true,
  imports: [CurrencyPipe,CommonModule],
  templateUrl: './products-wish-list.component.html',
  styleUrl: './products-wish-list.component.scss'
})
export class ProductsWishListComponent implements OnInit {
  user: IUser = {
    userId: 3,
    fName: 'Ahmad',
    lName: 'Esam',
    email: 'ahmad.esam@ex.com',
    password: '123',
    phone: "1015328933",
    governorate: 'Ghatbia',
    city: 'MAhalla',
    street: 'Farouk21',
    postalCode: "12345",
    isDeleted: false,
    role: 1
  };
  
  wishListProducts: IwhishListProduct[] = [];
  wishList?:IwhishListProduct[];

  constructor(private wishListService: WishListService) {}


  ngOnInit(): void {
    this.loadWishList();
    this.fetchWishList(this.user.userId!);

  }
  fetchWishList(UserId:number){
    this.wishListService.getWishList(UserId).subscribe(
      (data)=>{
        console.log("from success section")
        console.log(data);
        this.wishList=data;
     
       
        
      },
      (error)=>{
        console.log("error section")
        console.log(error);
        
      }
      
    );
   
  
  }

  loadWishList(): void {
    this.wishListService.getWishList(this.user.userId!).subscribe(
      (data) => {
        this.wishListProducts = data;
      },
      (error) => {
        console.error('Error fetching wishlist:', error);
      }
    );
  }

  removeFromWishList(productId: number): void {
    this.wishListService.deleteWishListProduct(this.user.userId!, productId).subscribe(
      () => {
        // Remove the product from the local list
        this.fetchWishList(this.user.userId!);
        this.loadWishList();
        this.wishListProducts = this.wishListProducts.filter((p) => p.productId !== productId);
      
      },
      (error) => {
        console.error('Error removing product from wishlist:', error);
      }
    );
  }
  removeFunc(productId: number): void {
    this.removeFromWishList(productId);
  }

}