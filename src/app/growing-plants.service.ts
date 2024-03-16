import { Injectable } from '@angular/core';
import { Plant, PlantData } from 'src/interfaces/plant';
import { AlmanacTrackerService } from './almanac-tracker.service';
import { SeedCombinationsService } from './seed-combinations.service';

@Injectable({
  providedIn: 'root'
})
export class GrowingPlantsService {
  plants: Array<Plant> = []

  constructor(private alamancTrackerService: AlmanacTrackerService, private seedCombinationService: SeedCombinationsService) { 
    setInterval(() => {this.growthTick()}, 250)
  }

  makePlant(plantData: PlantData | null, pattern: string){
    var newPlant: Plant = {
      plantName: "Sprout",
      plantData: plantData, 
      plantedPattern: pattern, 
      cycles: 0, 
      waterCycles: 0,
      maxCycles: pattern.length * 10,
      isInviable: false
    };
    
    if(plantData != null){
      newPlant.maxCycles = plantData.growthCycles
    }

    this.plants.push(newPlant);
  }

  harvestPlant(plant: Plant){
    this.plants = this.plants.filter(x => x != plant)

    if(plant.plantData == null){
      this.alamancTrackerService.submitFailedSeedPattern(plant.plantedPattern);
    } else {
      plant.plantData.discovered = true
    } 
  }

  getPlants(): Array<Plant>{
    return this.plants;
  }

  growthTick(){
    this.plants.forEach(plant => {
      if(plant.cycles < plant.maxCycles && !plant.isInviable && plant.waterCycles > 0){
        plant.waterCycles -= 1
        plant.cycles += 1
        
        if(plant.plantName == "Sprout" && plant.cycles >= plant.maxCycles / 2) {
          var associatedPlant = this.alamancTrackerService.checkSeedPattern(plant.plantedPattern);
          if(associatedPlant == null){
            plant.isInviable = true
            plant.plantName = "Inviable"
          } else {
            plant.plantData = associatedPlant
            plant.plantName = plant.plantData.name
          }
        }
      }
    })
  }
}
