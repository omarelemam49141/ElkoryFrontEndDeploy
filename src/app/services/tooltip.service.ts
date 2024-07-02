import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TooltipService {
  firstVisitKey = "firstVisit"
  constructor() { 

  }

  setFirstVisit() {
    if(!localStorage.getItem(this.firstVisitKey) || localStorage.getItem(this.firstVisitKey) == "true") {
      localStorage.setItem(this.firstVisitKey, "false");
      return true;
    }
    return false;
  }
}
