import { Component, OnInit, HostListener } from '@angular/core';
import { GrowingPlantsService } from '../growing-plants.service';
import { Dirt, Plant, ProspectiveDirt } from 'src/interfaces/plant';
import { SaveManagementService } from '../save-management.service';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.less']
})
export class FieldComponent implements OnInit {
  mouseIsDown = false;

  constructor(
    private growingPlantsService: GrowingPlantsService,
    private saveManagementService: SaveManagementService) { 
    setInterval(() => {this.updateFrame()}, 10)
  }

  ngOnInit(): void {
    this.saveManagementService.attemptLoad();
  }

  getFieldStyle(): Record<string, any>{
    return {
      "background-position-x": this.growingPlantsService.xOffset + "px",
      "background-position-y": this.growingPlantsService.yOffset + "px",
    }
  }

  getDirtStyle(dirt: Dirt | ProspectiveDirt): Record<string, any>{
    return {
      "width": this.growingPlantsService.dirtWidth + "px",
      "height": this.growingPlantsService.dirtHeight + "px",
      "left": this.growingPlantsService.getDirtPosition(dirt)[0] + "px",
      "top": this.growingPlantsService.getDirtPosition(dirt)[1] + "px",
    }
  }

  getPlant(dirt: Dirt): Plant | null{
    return this.growingPlantsService.getPlantFromDirt(dirt);
  }

  getSelectedDirt(): Dirt | null{
    return this.growingPlantsService.selectedDirt;
  }

  getDirtSpots(): Array<Dirt>{
    return this.growingPlantsService.dirtSpots
  }

  getProspectiveDirtSpots(): Array<ProspectiveDirt>{
    return this.growingPlantsService.prospectiveDirtSpots
  }

  updateFrame(){
    if(!this.mouseIsDown){
      if(this.growingPlantsService.xOffset > (this.growingPlantsService.dirtWidth * this.growingPlantsService.blocksAwayAllowed)){
        this.growingPlantsService.xOffset -= (this.growingPlantsService.xOffset - (this.growingPlantsService.dirtWidth * this.growingPlantsService.blocksAwayAllowed)) * .1
      } else if (this.growingPlantsService.xOffset < (this.growingPlantsService.dirtWidth * -this.growingPlantsService.blocksAwayAllowed)){
        this.growingPlantsService.xOffset -= (this.growingPlantsService.xOffset - (this.growingPlantsService.dirtWidth * -this.growingPlantsService.blocksAwayAllowed)) * .1
      }
      if(this.growingPlantsService.yOffset > (this.growingPlantsService.dirtHeight * this.growingPlantsService.blocksAwayAllowed)){
        this.growingPlantsService.yOffset -= (this.growingPlantsService.yOffset - (this.growingPlantsService.dirtHeight * this.growingPlantsService.blocksAwayAllowed)) * .1
      } else if (this.growingPlantsService.yOffset < (this.growingPlantsService.dirtHeight * -this.growingPlantsService.blocksAwayAllowed)){
        this.growingPlantsService.yOffset -= (this.growingPlantsService.yOffset - (this.growingPlantsService.dirtHeight * -this.growingPlantsService.blocksAwayAllowed)) * .1
      }
    }
  }

  onMouseDownProspective(dirt: ProspectiveDirt){
    this.growingPlantsService.addDirt(dirt.x, dirt.y);
    this.growingPlantsService.selectedDirt = null;
  }

  onBackgroundMouseDown(){
    this.growingPlantsService.selectedDirt = null;
  }

  onMouseDownDirt(dirt: Dirt){
    if(this.growingPlantsService.selectedDirt == dirt){
      this.growingPlantsService.selectedDirt = null;
    } else {
      this.growingPlantsService.selectedDirt = dirt;
    }
  }

  onMouseEnterDirt(dirt: Dirt){
    this.growingPlantsService.hoveredDirt = dirt;
  }

  onMouseExitDirt(dirt: Dirt){
    if(this.growingPlantsService.hoveredDirt == dirt){
      this.growingPlantsService.hoveredDirt = null
    }
  }

  onMouseDown(event: MouseEvent){
    if(event.button === 2){
      this.mouseIsDown = true;
    }
  }

  onMouseUp(event: MouseEvent){
    this.mouseIsDown = false;
  }

  onMouseMove(event: MouseEvent){
    if(this.mouseIsDown){
      this.growingPlantsService.xOffset += event.movementX
      this.growingPlantsService.yOffset += event.movementY
    }
  }

  @HostListener('window:keydown', ['$event'])
  onKeyPress(event: KeyboardEvent){
    if(event.code == "KeyC"){
      if(confirm("Clear all save data?")){
        this.saveManagementService.clearData();
      }
    }
  }

}
