import { Component, OnDestroy, OnInit } from '@angular/core';
import { ICategory } from '../../../Models/icategory';
import { Subscription } from 'rxjs';
import { CategoryService } from '../../../services/category.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WebInfoService } from '../../../services/WebInfo.service';
import { IWebInfo } from '../../../Models/IwebsiteInfo';
import { environment } from '../../../../environment/environment';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit,OnDestroy {
  Categories:ICategory[]=[];
  subscriptions:Subscription[]=[];
  webInfo:IWebInfo|undefined;


  constructor(private categoryService:CategoryService,private webInfoServise:WebInfoService){}

fetchCategories():void{
  const subscription= this.categoryService.getAll().subscribe(
    {
      next:(categories:ICategory[])=>{
        this.Categories=categories


      },
      error:(error:any)=>console.error('Erroe fetching categories',error)}
      );
      this.subscriptions.push(subscription);
    }


  
 






  



  ngOnDestroy(): void {
    this.subscriptions.forEach(sub=>sub.unsubscribe());
  }
  ngOnInit(): void {
this.fetchCategories();




  }


}
