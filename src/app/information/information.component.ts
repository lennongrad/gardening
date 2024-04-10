import { Component, Input, OnInit } from '@angular/core';
import { SaveManagementService } from '../save-management.service';
import { QuestService } from '../quest.service';
import { DebugService } from '../debug.service';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.less']
})
export class InformationComponent implements OnInit {
  
  @Input() activeWindow: boolean = false;

  constructor(
    private questService: QuestService,
    private debugService: DebugService,
    private saveManagementService: SaveManagementService) { }

  ngOnInit(): void {
  }

  toggleOption(optionName: string){
    this.saveManagementService.toggleSetting(optionName)
  }

  activeOption(optionName: string): boolean{
    return this.saveManagementService.getSetting(optionName)
  }

  skipAllTutorials(){
    if(confirm("Are you sure you want to skip all tutorials? You might get confused!")){
      this.questService.skipAllTutorials()
    }
  }

  getBuild(): string{
    return this.debugService.currentBuild;
  }
  

  clearSave(){
    if(confirm("Clear all save data?")){
      this.saveManagementService.clearData();
    }
  }

}
