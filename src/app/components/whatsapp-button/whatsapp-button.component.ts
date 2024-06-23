import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-whatsapp-button',
  standalone: true,
  imports:[],
  templateUrl: './whatsapp-button.component.html',
  styleUrls: ['./whatsapp-button.component.scss']
})
export class WhatsappButtonComponent implements OnInit {

  phone: string = '+201098031739'; // Your WhatsApp number
  message: string = 'Hello, How Can We Help You'; // Your message

  constructor() { }

  ngOnInit(): void {
    this.loadWhatsAppScript();
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
        phone: this.phone,
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
    const url = `https://wa.me/${this.phone}?text=${encodeURIComponent(this.message)}`;
    window.open(url, '_blank');
  }
}
