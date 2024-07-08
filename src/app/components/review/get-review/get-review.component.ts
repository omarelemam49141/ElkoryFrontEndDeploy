import { Component, ErrorHandler, Input, OnInit } from '@angular/core';
import { IRate } from '../../../Models/irate';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReviewService } from '../../../services/review.service';
import { AccountService } from '../../../services/account.service';
import { AdminService } from '../../../services/admin.service';
import { IUser } from '../../../Models/iuser';

@Component({
  selector: 'app-get-review',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './get-review.component.html',
  styleUrl: './get-review.component.scss'
})
export class GetReviewComponent implements OnInit{
  @Input() productId: number = 0;

  // @Input() productId: number = 0;
  reviewsList: IRate[] = [];
  customrsNames: string[] = [];


  constructor(private reviewService: ReviewService,private adminSevice:AdminService) { }

  ngOnInit(): void {

    this.reviewService.getProductReviews(this.productId).subscribe((data: IRate[]) => {
      this.reviewsList = data;
      let cutomers: IUser[] = [];
      this.adminSevice.GetAllUsers().subscribe((data: IUser[]) => {
        cutomers = data;
        for (let i = 0; i < this.reviewsList.length; i++) {
          let customerName = data.find(c => c.userId == this.reviewsList[i].customerId)?.fName;
       if(customerName) this.customrsNames.push(customerName);}
      });
      
 
      
      // console.log("Reviews", this.reviewsList);
    },
    error => {
      console.error("Error fetching Reviews", error);
    });

  }

  //generating stars based on the rating
  getStars(numOfStars: number): string {
    let starsHtml = '';
    for (let i = 0; i < 5; i++) {
      if (i < numOfStars) {
        starsHtml += `<i class="fa-solid fa-star fa-2x"></i>`;
      } else {
        starsHtml += '<i class="fa-regular fa-star fa-2x"></i>';
      }
    }
    return starsHtml;
  }

}
