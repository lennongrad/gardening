import { Component, Input, OnInit } from '@angular/core';
import { GrowingPlantsService } from '../growing-plants.service';
import { Plant } from 'src/interfaces/plant';

@Component({
  selector: 'app-plant',
  templateUrl: './plant.component.html',
  styleUrls: ['./plant.component.less']
})
export class PlantComponent implements OnInit {
  @Input() plant: Plant | null = null;

  constructor(private growingPlantsService: GrowingPlantsService) { }

  ngOnInit(): void {
  }

  waterPlant(){
    if(this.plant != null){
      this.plant.waterCycles += 5
    }
  }

  harvestPlant(){
    if(this.plant != null){
      this.growingPlantsService.harvestPlant(this.plant);
    }
  }

}
