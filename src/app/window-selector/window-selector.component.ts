import { Component, OnInit } from '@angular/core';
import { TabWindow } from 'src/interfaces/window';
import { WindowManagerService } from '../window-manager.service';
import { SeedCombinationsService } from '../seed-combinations.service';
import { QuestService } from '../quest.service';

@Component({
  selector: 'app-window-selector',
  templateUrl: './window-selector.component.html',
  styleUrls: ['./window-selector.component.less']
})
export class WindowSelectorComponent implements OnInit {

  constructor(private windowManagerService: WindowManagerService, private seedCombinationService: SeedCombinationsService) { }

  ngOnInit(): void {
  }

  getExperience(): string{
    return this.seedCombinationService.getPrettyNumber(this.seedCombinationService.experience)
  }
  getMoney(): string{
    return this.seedCombinationService.getPrettyNumber(this.seedCombinationService.money)
  }


  getWindows(): Array<TabWindow>{
    return this.windowManagerService.windows
  }

  selectWindow(tab: TabWindow){
    this.windowManagerService.selectWindow(tab)
  }

}
