import { Component, OnInit, HostListener } from '@angular/core';
import { GrowingPlantsService } from '../growing-plants.service';
import { Dirt, Plant, ProspectiveDirt } from 'src/interfaces/plant';
import { SaveManagementService } from '../save-management.service';
import { SeedCombinationsService } from '../seed-combinations.service';
import { CollectedItemAnimation } from 'src/interfaces/seed';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.less']
})
export class FieldComponent implements OnInit {
  mouseIsDown = false;

  constructor(
    private growingPlantsService: GrowingPlantsService,
    private seedCombinationService: SeedCombinationsService,
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

  getCollectedItemStyle(item: CollectedItemAnimation): Record<string,any>{
    var relativePosition = this.growingPlantsService.getRelativePosition([item.x, item.y])

    return {
      "left": relativePosition[0] + "px",
      "top": relativePosition[1] + "Px",
      "opacity": 1 - Math.pow(item.time / this.seedCombinationService.collectedItemMaxTime, 2)
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

  getCollectedItemAnimations(): Array<CollectedItemAnimation>{
    return this.seedCombinationService.collectedItemAnimations
  }

  getProspectiveDirtSpots(): Array<ProspectiveDirt>{
    return this.growingPlantsService.prospectiveDirtSpots
  }

  getHoeing(): boolean{
    if(this.seedCombinationService.selectedTool == null){
      return false;
    }
    return this.seedCombinationService.selectedTool.tool.id == 0
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
    if(this.seedCombinationService.selectedTool != null && this.seedCombinationService.selectedTool.tool.id == 0){
      this.growingPlantsService.addDirt(dirt.x, dirt.y);
      this.growingPlantsService.selectedDirt = null;
      this.seedCombinationService.useTool(this.seedCombinationService.selectedTool)

    }
  }

  onBackgroundMouseDown(){
    this.growingPlantsService.selectedDirt = null;
    this.seedCombinationService.selectedTool = null;
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
