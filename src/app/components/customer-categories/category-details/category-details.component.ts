import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AccountService } from '../../../services/account.service';
import { ICategoryDetails } from '../../../Models/IcategoryDetails';
import { CategoryService } from '../../../services/category.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-category-details',
  standalone: true,
  imports: [RouterLink, CommonModule, CurrencyPipe, FormsModule],
  templateUrl: './category-details.component.html',
  styleUrl: './category-details.component.scss'
})
export class CategoryDetailsComponent implements OnInit, OnDestroy {
  constructor(private accountService:AccountService,
    private route: ActivatedRoute,
    private categoryService:CategoryService

  ){}
  userLoggedID!: number 
  category!:ICategoryDetails
  subscriptions: Subscription[] = [];


  ngOnDestroy(): void {
this.subscriptions.forEach(sub=>sub.unsubscribe())  }
  ngOnInit(): void {
    this.userLoggedID=this.accountService.getTokenId();
    if(this.userLoggedID){
      
    }
    this.route.paramMap.subscribe(param=>{
      const categoryId=Number(param.get('categoryId'));
      this.fetchCategory(categoryId)

    })

  }
  fetchCategory(categoryId:number):void{
    const subscription=this.categoryService.getCategoryDetails(categoryId).subscribe(
      {
        next:(data:ICategoryDetails)=>{
          this.category=data
        },
        error:(err:any)=>console.error('Error fetching category details',err)
        
      }
    );
    this.subscriptions.push(subscription);

  }

}
