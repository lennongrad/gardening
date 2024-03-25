import { Component, OnInit } from '@angular/core';
import { TabWindow } from 'src/interfaces/window';
import { WindowManagerService } from '../window-manager.service';

@Component({
  selector: 'app-window-selector',
  templateUrl: './window-selector.component.html',
  styleUrls: ['./window-selector.component.less']
})
export class WindowSelectorComponent implements OnInit {

  constructor(private windowManagerService: WindowManagerService) { }

  ngOnInit(): void {
  }

  getWindows(): Array<TabWindow>{
    return this.windowManagerService.windows
  }

  selectWindow(tab: TabWindow){
    this.windowManagerService.selectWindow(tab)
  }

}
