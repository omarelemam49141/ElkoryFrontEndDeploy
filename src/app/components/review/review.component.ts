import { Component } from '@angular/core';
import { IRate } from '../../Models/irate';
import { ReviewService } from '../../services/review.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-review',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './review.component.html',
  styleUrl: './review.component.scss'
})
export class ReviewComponent {
  rate: IRate = {
    productId: 0,
    customerId: 0,
    numOfStars: 0,
    comment: '',
    rateDate: new Date()
  };

  constructor(private reviewService: ReviewService) {}

  addReview(): void {
    this.reviewService.addReview(this.rate).subscribe((data) => {
      console.log(data);
    });
  }

  // getReview(): void {
  //   this.reviewService.getReview(1, 1).subscribe((data) => {
  //     console.log(data);
  //   });
  // }
}
