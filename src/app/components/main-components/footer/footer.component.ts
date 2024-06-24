import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { WebInfoService } from '../../../services/WebInfo.service';
import { IWebInfo } from '../../../Models/IwebsiteInfo';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent implements OnInit {
  // inject webInfo service
  webInfoService: WebInfoService;
  iwebInfo: IWebInfo = {} as IWebInfo;

  constructor(webInfoService: WebInfoService) {
    this.webInfoService = webInfoService;
  }

  ngOnInit(): void {
    this.webInfoService.getWebInfo().subscribe((data) => {
      this.iwebInfo = data;
      console.log(this.iwebInfo);
    });
  }

  getCurrentYear() {
    return new Date().getFullYear();
  }
}
