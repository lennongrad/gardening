import { Injectable } from '@angular/core';
import { TabWindow } from 'src/interfaces/window';

@Injectable({
  providedIn: 'root'
})
export class WindowManagerService {
  windows: Array<TabWindow> = [
    {name: "Almanac", icon: "book-cover.svg"},
    {name: "Information", icon: "cog.svg"},
  ]
  activeWindow: TabWindow | null = null;

  constructor() {
    this.selectWindow(this.windows[0])
  }

  getActiveWindow(): TabWindow | null{
    return this.activeWindow;
  }

  selectWindow(newWindow: TabWindow){
    if(this.activeWindow == newWindow){
      this.activeWindow = null
    } else {
      this.activeWindow = newWindow
    }
  }
}
