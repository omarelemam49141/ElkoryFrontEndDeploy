import { Component, OnDestroy, OnInit } from '@angular/core';
import { WebInfoService } from '../../services/WebInfo.service';
import { IWebInfo } from '../../Models/IwebsiteInfo';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-whatsapp-button',
  standalone: true,
  imports:[],
  templateUrl: './whatsapp-button.component.html',
  styleUrls: ['./whatsapp-button.component.scss']
})
export class WhatsappButtonComponent implements OnInit , OnDestroy{

  phone: string = '+201098031739'; // Your WhatsApp number
  message: string = 'Hello, How Can We Help You'; // Your message

  constructor( private webInfoService: WebInfoService) { }


  subscriptions: Subscription[] = [];


  webInfo: IWebInfo | undefined;

  fetchWebInfo(): void {
      const subscription = this.webInfoService.getWebInfo().subscribe({
        next: (webInfo: IWebInfo) => {
          
          this.webInfo = webInfo;
          console.log('Assigned webInfo:', this.webInfo);
        },
        error: (error: any) => {
          // console.error('Error fetching web info', error);
        }
      });
      this.subscriptions.push(subscription);
    }

  ngOnInit(): void {
    this.loadWhatsAppScript();
    this.fetchWebInfo();
  }

  loadWhatsAppScript() {
    const script = document.createElement('script');
    script.src = 'assets/whatsapp/floating-wpp.min.js';
    script.async = true;
    script.onload = () => this.initializeFloatingWhatsApp();
    document.body.appendChild(script);
  }

  initializeFloatingWhatsApp() {
    if ((window as any).floatingWhatsApp) {
      (window as any).floatingWhatsApp({
        phone: this.webInfo?.webPhone || this.phone,
        headerTitle: 'Message',
        popupMessage: this.message,
        showPopup: true,
        buttonImage: '',
        headerColor: 'green',
        position: 'right',
      });
    } else {
      console.error('floatingWhatsApp plugin not loaded');
    }
  }

  openWhatsApp() {
    const url = `https://wa.me/${this.webInfo?.webPhone||this.phone}?text=${encodeURIComponent(this.message)}`;
    window.open(url, '_blank');
  }


  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
