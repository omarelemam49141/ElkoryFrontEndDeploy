import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faBars, faChevronDown, faUserTie, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { IWebInfo } from '../../../Models/IwebsiteInfo';
import { WebInfoService } from '../../../services/WebInfo.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-top-header',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, RouterLink],
  templateUrl: './top-header.component.html',
  styleUrls: ['./top-header.component.scss']
})
export class TopHeaderComponent implements OnDestroy, OnInit {
  subscriptions: Subscription[] = [];
  webInfo: IWebInfo | undefined;

  constructor(library: FaIconLibrary, private webInfoService: WebInfoService) {
    library.addIcons(faBars, faChevronDown, faUserTie, faShoppingCart);
  }

  fetchWebInfo(): void {
    const subscription = this.webInfoService.getWebInfo().subscribe({
      next: (webInfo: IWebInfo) => {
        console.log(this.webInfo)
        this.webInfo = webInfo;
        console.log('Assigned webInfo:', this.webInfo);
      },
      error: (error: any) => {
        console.error('Error fetching web info', error);
      }
    });
    this.subscriptions.push(subscription);
  }

  ngOnInit(): void {
    this.fetchWebInfo();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
