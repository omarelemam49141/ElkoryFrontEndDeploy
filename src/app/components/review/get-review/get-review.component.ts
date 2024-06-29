import { Component, ErrorHandler, Input } from '@angular/core';
import { IRate } from '../../../Models/irate';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReviewService } from '../../../services/review.service';

@Component({
  selector: 'app-get-review',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './get-review.component.html',
  styleUrl: './get-review.component.scss'
})
export class GetReviewComponent {

  // @Input() productId: number = 0;
  reviewsList: IRate[] = [];

  constructor(private reviewService: ReviewService) { }

  ngOnInit(): void {
    this.reviewService.getProductReviews(1).subscribe((data: IRate[]) => {
      this.reviewsList = data;
      console.log("Reviews", this.reviewsList);
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
