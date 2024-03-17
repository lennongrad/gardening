import { Injectable } from '@angular/core';
import { Dirt, Plant, PlantData, ProspectiveDirt } from 'src/interfaces/plant';
import { AlmanacTrackerService } from './almanac-tracker.service';
import { SeedCombinationsService } from './seed-combinations.service';

@Injectable({
  providedIn: 'root'
})
export class GrowingPlantsService {
  plants: Array<Plant> = []

  hoveredDirt: Dirt | null = null;
  selectedDirt: Dirt | null = null;

  xOffset: number = 0
  yOffset: number = 0

  dirtWidth: number = 100
  dirtHeight: number = 100
  blocksAwayAllowed: number = 10

  constructor(private alamancTrackerService: AlmanacTrackerService, private seedCombinationService: SeedCombinationsService) { 
    setInterval(() => {this.growthTick()}, 250)
  }

  getPlantFromDirt(dirt: Dirt): Plant | null{
    var matchingPlants = this.plants.filter(plant => plant.dirt == dirt)

    if(matchingPlants.length != 1){
      return null;
    }
    return matchingPlants[0]
  }

  makePlant(plantData: PlantData | null, pattern: string, dirt: Dirt){
    var newPlant: Plant = {
      plantName: "Sprout",
      dirt: dirt,
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
      Object.keys(plant.plantData.staticInfo.resultSeeds).forEach(seed => {
        var matchingSeed = this.seedCombinationService.getSeedByID(seed)
        if(matchingSeed != null){
          this.seedCombinationService.gainSeed(matchingSeed, plant.plantData?.staticInfo.resultSeeds[seed]!)
        }
      })
      plant.plantData.discovered = true
    } 
  }

  getDirtPosition(dirt: Dirt | ProspectiveDirt): [number, number]{
    return [
      dirt.x * this.dirtWidth + this.xOffset + (window.innerWidth / 2 - this.dirtWidth / 2),
      dirt.y * this.dirtHeight + this.yOffset + (window.innerHeight / 2 - this.dirtHeight / 2)
    ]
  }

  getPlants(): Array<Plant>{
    return this.plants;
  }

  growthTick(){
    if(this.seedCombinationService.seeds[0].amount == 0 && this.plants.length == 0){
      this.seedCombinationService.gainSeed(this.seedCombinationService.seeds[0].seed, 1)
    }

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
            plant.plantName = plant.plantData.staticInfo.name
          }
        }
      }
    })
  }
}
