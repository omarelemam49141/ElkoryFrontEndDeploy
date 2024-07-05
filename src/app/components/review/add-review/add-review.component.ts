import { Component, Input, OnInit } from '@angular/core';
import { IRate } from '../../../Models/irate';
import { ReviewService } from '../../../services/review.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { AccountService } from '../../../services/account.service';


@Component({
  selector: 'app-add-review',
  standalone: true,
  imports: [FormsModule, CommonModule, FontAwesomeModule],
  templateUrl: './add-review.component.html',
  styleUrl: './add-review.component.scss'
})
export class AddReviewComponent implements OnInit{
  @Input() productId: number = 0;
  @Input() customerId: number = 0;

  rate: IRate = {
    productId: 0,
    customerId: 0,
    numOfStars: 0,
    comment: '',
    rateDate: new Date()
  };

  faStar = faStar;
  rating: number = 0;

  constructor(private reviewService: ReviewService,
    private accountService: AccountService,
  ) {this.rate.customerId= this.accountService.getTokenId();}
  ngOnInit(): void {
this.rate.customerId=this.customerId;
this.rate.productId=this.productId; 
}

  addReview(): void {
    let finalDate = this.getFinalDate();
    this.rate.rateDate = finalDate;
    console.log(this.customerId);
    console.log(this.rate.customerId)
    console.log(this.rate);

    this.reviewService.addReview(this.rate).subscribe((data) => {
      console.log(data);
    });
  }


  setRating(value: number) {
    this.rating = value;
    this.rate.numOfStars = value;
  }
  getFinalDate(): string {
    const now = new Date();
    const year = now.getFullYear();
    let month = (now.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 because getMonth() returns zero-based index
    let day = now.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

}
