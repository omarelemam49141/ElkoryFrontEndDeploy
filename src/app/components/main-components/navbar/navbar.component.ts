import { Component, OnDestroy, OnInit } from '@angular/core';
import { ICategory } from '../../../Models/icategory';
import { Subscription } from 'rxjs';
import { CategoryService } from '../../../services/category.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WebInfoService } from '../../../services/WebInfo.service';
import { IWebInfo } from '../../../Models/IwebsiteInfo';
import { environment } from '../../../../environment/environment';
import { ICategoryDetails } from '../../../Models/IcategoryDetails';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'] // Corrected styleUrls property
})
export class NavbarComponent implements OnInit, OnDestroy {
  Categories: ICategoryDetails[] = [];
  oldCatogries: ICategory[] = [];
  subscriptions: Subscription[] = [];
  webInfo: IWebInfo | undefined;
  activeCategory: string = ''; // Property to track the active category

  constructor(private categoryService: CategoryService, private webInfoServise: WebInfoService) {}

  // fetchCategories(): void {
  //   const subscription = this.categoryService.getAll().subscribe({
  //     next: (categories: ICategory[]) => {
  //       this.oldCatogries = categories;
  //       console.log('Fetched categories:', this.oldCatogries);
  //     },
  //     error: (error: any) => console.error('Error fetching categories', error)
  //   });
  //   this.subscriptions.push(subscription);
  // }
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
  setActiveCategory(category: string): void { // Method to set the active category
    this.activeCategory = category;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  ngOnInit(): void {
    // this.fetchCategories();
    this.fetchCatogorieswithDetails();
    // this.fetchCategories();
    // console.log(this.oldCatogries)
    console.log(this.Categories)
  }
}
