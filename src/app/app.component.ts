import { Component } from '@angular/core';
import { WindowManagerService } from './window-manager.service';
import { TabWindow } from 'src/interfaces/window';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'Gardening';

  constructor(private windowManagerService: WindowManagerService){  
  }

  getActiveWindow(): TabWindow | null{
    return this.windowManagerService.getActiveWindow();
  }
}
