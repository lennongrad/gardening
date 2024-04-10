import { Injectable } from '@angular/core';
import { TabWindow } from 'src/interfaces/window';
import { QuestService } from './quest.service';
import { DebugService } from './debug.service';

@Injectable({
  providedIn: 'root'
})
export class WindowManagerService {
  windows: Array<TabWindow> = [
    {name: "Almanac", icon: "book-cover.svg"},
    {name: "Tools", icon: "light-bulb.svg"},
    {name: "Shop", icon: "price-tag.svg"},
    {name: "Information", icon: "cog.svg"},
  ]
  activeWindow: TabWindow | null = null;

  constructor(
    private questService: QuestService,
    private debugService: DebugService,
  ) {
    if(debugService.getDebugSetting("openWindow")){
      this.selectWindow(this.windows[debugService.getDebugSetting("openWindow")])
    }
  }

  getActiveWindow(): TabWindow | null{
    return this.activeWindow;
  }

  selectWindow(newWindow: TabWindow){
    this.questService.registerTrigger("close" + newWindow.name)
    if(this.activeWindow == newWindow){
      this.activeWindow = null
    } else {
      this.activeWindow = newWindow
      this.questService.registerTrigger("open" + newWindow.name)
    }
  }
}
