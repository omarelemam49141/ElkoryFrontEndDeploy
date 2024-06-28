import { Component } from '@angular/core';
import { IRate } from '../../../Models/irate';

@Component({
  selector: 'app-get-review',
  standalone: true,
  imports: [],
  templateUrl: './get-review.component.html',
  styleUrl: './get-review.component.scss'
})
export class GetReviewComponent {

  rate:IRate = {
    productId: 0,
    customerId: 0,
    numOfStars: 0,
    comment: '',
    rateDate: new Date()
  };

  constructor() {}

  ngOnInit(): void {
    this.getReview();
  }

  getReview(): void {

  }
}
