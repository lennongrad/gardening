import { Component, OnInit } from '@angular/core';
import { GrowingPlantsService } from '../growing-plants.service';
import { Plant } from 'src/interfaces/plant';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.less']
})
export class FieldComponent implements OnInit {

  constructor(private growingPlantsService: GrowingPlantsService) { }

  ngOnInit(): void {
  }

  waterPlant(plant: Plant){
    plant.waterCycles += 5
  }

  harvestPlant(plant: Plant){
    this.growingPlantsService.harvestPlant(plant);
  }

  getGrowingPlants(): Array<Plant>{
    return this.growingPlantsService.getPlants();
  }

}
