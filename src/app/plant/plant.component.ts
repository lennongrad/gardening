import { Component, Input, OnInit } from '@angular/core';
import { GrowingPlantsService } from '../growing-plants.service';
import { Plant } from 'src/interfaces/plant';
import { SeedCombinationsService } from '../seed-combinations.service';

@Component({
  selector: 'app-plant',
  templateUrl: './plant.component.html',
  styleUrls: ['./plant.component.less']
})
export class PlantComponent implements OnInit {
  @Input() plant: Plant | null = null;

  berryImageWidth: number = 11
  berryImageHeight: number = 4

  plantImageWidth: number = 48
  plantImageHeight: number = 96

  constructor(
    private growingPlantsService: GrowingPlantsService,
    private seedCombinationService: SeedCombinationsService) { }

  ngOnInit(): void {
  }

  getPlantDisplayStyle(): Record<string,any>{
    if(this.plant == null)
      return {}

    var backgroundSizeWidth = this.plantImageWidth * this.berryImageWidth * 6;
    var backgroundSizeHeight = this.plantImageHeight * this.berryImageHeight;


    var backgroundCoordinateX = (this.berryImageWidth - 1) * 6
    var backgroundCoordinateY = this.berryImageHeight - 1
    var flipSprite = false

    if(this.getPlantAge() != 0 && this.plant.plantData != null){
      var spriteIndex = this.plant.plantData?.staticInfo.spriteIndex
      backgroundCoordinateX = (spriteIndex % this.berryImageWidth) * 6;
      backgroundCoordinateY = Math.floor(spriteIndex / this.berryImageWidth);
    }
    
    if(this.getPlantAge() == 2){
      backgroundCoordinateX += 2
    }

    if(this.plant.animationTimer > this.growingPlantsService.timerMax * (3/4)){
      backgroundCoordinateX += 1
      flipSprite = true
    } else if(this.plant.animationTimer > this.growingPlantsService.timerMax * (1/2)){
    } else if(this.plant.animationTimer > this.growingPlantsService.timerMax * (1/4)){
      backgroundCoordinateX += 1
    }

    if(this.getPlantAge() != 0 && this.plant.plantData == null){
      backgroundCoordinateX = (this.berryImageWidth - 1) * 6 - 1
      flipSprite = false
    }

    return {
      "width": this.plantImageWidth + "px",
      "height": this.plantImageHeight + "px",
      "transform": "translate(-50%, -" + this.plantImageWidth + "px) " + (flipSprite ? "scaleX(-100%) " : ""),
      "background-size": backgroundSizeWidth + "px " + backgroundSizeHeight + "px",
      "background-position-x": -backgroundCoordinateX * this.plantImageWidth + "px",
      "background-position-y": -backgroundCoordinateY * this.plantImageHeight + "px",
      
    }
  }

  getPlantAge(): number | null{
    if(this.plant == null) return null

    var maxCycles = this.growingPlantsService.getMaxCycles(this.plant)

    if(this.plant.cycles < maxCycles / 2){
      return 0;
    }

    if(this.plant.cycles < maxCycles){
      return 1;
    }

    return 2;
  }

  clickPlant(){
    if(this.plant != null){
      this.growingPlantsService.clickPlant(this.plant)
    }
  }

  getPlantName(): string{
    if(this.plant == null){
      return "";
    }
    return this.growingPlantsService.getPlantName(this.plant);
  }

  getMaxCycles(): number{
    if(this.plant == null){
      return 0;
    }
    return this.growingPlantsService.getMaxCycles(this.plant);
  }

  isInviable(): boolean{
    if(this.plant == null){
      return true;
    }
    return this.growingPlantsService.isInviable(this.plant)
  }

}
