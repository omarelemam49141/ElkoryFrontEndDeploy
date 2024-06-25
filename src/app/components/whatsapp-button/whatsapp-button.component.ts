import { Component, OnDestroy, OnInit } from '@angular/core';
import { WebInfoService } from '../../services/WebInfo.service';
import { IWebInfo } from '../../Models/IwebsiteInfo';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-whatsapp-button',
  standalone: true,
  templateUrl: './whatsapp-button.component.html',
  styleUrls: ['./whatsapp-button.component.scss'],
})

export class WhatsappButtonComponent implements OnInit, OnDestroy {
  phone: string = '+201021275272'; // Your WhatsApp number
  message: string = 'مرحبًا، كيف يمكننا مساعدتك؟'; // Your message in Arabic

  constructor( private webInfoService: WebInfoService) {}
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
    script.src = '/assets/whatsapp/floating-wpp.min.js';
    script.async = true;
    script.onload = () => this.initializeFloatingWhatsApp();
    script.onerror = () =>
      console.error('Error loading floatingWhatsApp script');
    document.body.appendChild(script);
  }

  initializeFloatingWhatsApp() {
    if ((window as any).$ && (window as any).$.fn.floatingWhatsApp) {
      (window as any).$('#WAButton').floatingWhatsApp({
        phone: this.webInfo?.webPhone,
        headerTitle: 'رسالة', // Popup title in Arabic
        popupMessage: this.message,
        showPopup: true,
        buttonImage: '<img src="/assets/whatsapp/whatsapp.svg"/>',
        headerColor: 'green',
        position: 'right',
        click: () => this.openWhatsApp(event), // Custom click handler
      });
    } else {
      console.error('floatingWhatsApp plugin not loaded');
    }
  }

  openWhatsApp(event: any) {
    if (event) {
      const target = event.target as HTMLElement;
      if (target.id === 'whatsappImg' || target.closest('svg')) {
        (window as any).open(
          `https://wa.me/${this.phone}?text=${encodeURIComponent(this.message)}`
        );
      }
    } else {
      (window as any).open(
        `https://wa.me/${this.phone}?text=${encodeURIComponent(this.message)}`
      );
    }
  }


  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
