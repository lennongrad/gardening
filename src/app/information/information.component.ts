import { Component, Input, OnInit } from '@angular/core';
import { SaveManagementService } from '../save-management.service';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.less']
})
export class InformationComponent implements OnInit {
  
  @Input() activeWindow: boolean = false;

  constructor(private saveManagementService: SaveManagementService) { }

  ngOnInit(): void {
  }

  clearSave(){
    if(confirm("Clear all save data?")){
      this.saveManagementService.clearData();
    }
  }

}
