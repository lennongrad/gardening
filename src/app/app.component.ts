import { Component } from '@angular/core';
import { WindowManagerService } from './window-manager.service';
import { TabWindow } from 'src/interfaces/window';
import { DataLoaderService } from './data-loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'Gardening';

  constructor(private windowManagerService: WindowManagerService, private dataLoaderSerice: DataLoaderService){  
    dataLoaderSerice.attemptLoadPlants()
  }

  getActiveWindow(): TabWindow | null{
    return this.windowManagerService.getActiveWindow();
  }
}
