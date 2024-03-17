import { Component, OnInit, HostListener } from '@angular/core';
import { GrowingPlantsService } from '../growing-plants.service';
import { Dirt, Plant, ProspectiveDirt } from 'src/interfaces/plant';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.less']
})
export class FieldComponent implements OnInit {
  dirtSpots: Array<Dirt> = []
  prospectiveDirtSpots: Array<ProspectiveDirt> = [];
  mouseIsDown = false;

  constructor(private growingPlantsService: GrowingPlantsService) { 
    setInterval(() => {this.updateFrame()}, 10)
  }

  ngOnInit(): void {
    this.addDirt(0,0)
    /*
    this.addDirt(1,0)
    this.addDirt(0,1)
    this.addDirt(-1,0)
    this.addDirt(0,-1)
    */

    /*
    for(var x = -10; x < 11; x++){
      for(var y = -10; y < 11; y++){
        this.addDirt(x,y)
      }
    }
    */
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

  addDirt(x: number, y: number){
    if(this.dirtSpots.some(dirt => dirt.x == x && dirt.y == y)){
      return;
    }

    this.dirtSpots.push({id: this.dirtSpots.length, x: x, y: y})

    this.prospectiveDirtSpots = []
    var relativePositions = [[1,0], [0,1], [-1,0], [0,-1]]
    this.dirtSpots.forEach(dirt => {
      relativePositions.forEach(displacement => {
        if(!this.prospectiveDirtSpots.concat(this.dirtSpots).some(otherSpot => otherSpot.x == dirt.x + displacement[0] && otherSpot.y == dirt.y + displacement[1])){
          this.prospectiveDirtSpots.push({x: dirt.x + displacement[0], y: dirt.y + displacement[1]})
        }
      })
    })
  }

  getPlant(dirt: Dirt): Plant | null{
    return this.growingPlantsService.getPlantFromDirt(dirt);
  }

  getSelectedDirt(): Dirt | null{
    return this.growingPlantsService.selectedDirt;
  }

  getProspectiveDirtSpots(): Array<ProspectiveDirt>{
    return this.prospectiveDirtSpots
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
    this.addDirt(dirt.x, dirt.y);
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

}
