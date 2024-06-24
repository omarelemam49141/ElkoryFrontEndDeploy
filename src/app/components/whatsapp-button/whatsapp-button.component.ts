import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-whatsapp-button',
  standalone: true,
  templateUrl: './whatsapp-button.component.html',
  styleUrls: ['./whatsapp-button.component.scss'],
})
export class WhatsappButtonComponent implements OnInit {
  phone: string = '+201021275272'; // Your WhatsApp number
  message: string = 'مرحبًا، كيف يمكننا مساعدتك؟'; // Your message in Arabic

  constructor() {}

  ngOnInit(): void {
    this.loadWhatsAppScript();
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
        phone: this.phone,
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
}
