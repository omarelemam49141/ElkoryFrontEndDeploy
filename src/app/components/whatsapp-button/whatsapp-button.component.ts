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
<<<<<<< HEAD
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
=======
export class WhatsappButtonComponent implements OnInit {
  phone: string = '+201021275272'; // Your WhatsApp number
  message: string = 'مرحبًا، كيف يمكننا مساعدتك؟'; // Your message in Arabic

  constructor() {}
>>>>>>> 691b7cd6b02bb83d430da2c7748296080a56b778

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
<<<<<<< HEAD
    if ((window as any).floatingWhatsApp) {
      (window as any).floatingWhatsApp({
        phone: this.webInfo?.webPhone || this.phone,
        headerTitle: 'Message',
=======
    if ((window as any).$ && (window as any).$.fn.floatingWhatsApp) {
      (window as any).$('#WAButton').floatingWhatsApp({
        phone: this.phone,
        headerTitle: 'رسالة', // Popup title in Arabic
>>>>>>> 691b7cd6b02bb83d430da2c7748296080a56b778
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

<<<<<<< HEAD
  openWhatsApp() {
    const url = `https://wa.me/${this.webInfo?.webPhone||this.phone}?text=${encodeURIComponent(this.message)}`;
    window.open(url, '_blank');
=======
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
>>>>>>> 691b7cd6b02bb83d430da2c7748296080a56b778
  }


  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
