import { Injectable } from '@angular/core';
import { Dirt, Plant, PlantData, ProspectiveDirt, SaveableDirt, SaveablePlant } from 'src/interfaces/plant';
import { AlmanacTrackerService } from './almanac-tracker.service';
import { SeedCombinationsService } from './seed-combinations.service';
import { SaveManagementService } from './save-management.service';

@Injectable({
  providedIn: 'root'
})
export class GrowingPlantsService {
  saveManagementService!: SaveManagementService;

  dirtSpots: Array<Dirt> = []
  prospectiveDirtSpots: Array<ProspectiveDirt> = [];
  plants: Array<Plant> = []

  hoveredDirt: Dirt | null = null;
  selectedDirt: Dirt | null = null;

  xOffset: number = 0
  yOffset: number = 0

  dirtWidth: number = 100
  dirtHeight: number = 100
  blocksAwayAllowed: number = 10

  constructor(
    private alamancTrackerService: AlmanacTrackerService, 
    private seedCombinationService: SeedCombinationsService) { 
    setInterval(() => {this.growthTick()}, 250)
  }

  onLoadSave(loadedDirt: Array<SaveableDirt>, loadedPlants: Array<SaveablePlant>): boolean{
    if(loadedDirt.length == 0){
      return false;
    }

    loadedDirt.forEach(dirt => {
      this.dirtSpots.push({id: dirt.id, x: dirt.x, y: dirt.y})
    })
    this.redefineProspective()

    loadedPlants.forEach(plant => {
      this.plants.push({
        dirt: this.dirtSpots.filter(x => x.id == plant.dirtID)[0],
        plantData: this.alamancTrackerService.checkSeedPattern(plant.plantedPattern),
        plantedPattern: plant.plantedPattern,
        cycles: plant.cycles,
        waterCycles: plant.waterCycles
      })
    })
    return true;
  }

  onNoSave(){
    for(var x = -this.blocksAwayAllowed; x <= this.blocksAwayAllowed; x++){
      for(var y = -this.blocksAwayAllowed; y <= this.blocksAwayAllowed; y++){
        this.prospectiveDirtSpots.push({x: x, y:y})
      }
    }
    //this.addDirt(0,0)

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

  addDirt(x: number, y: number){
    if(this.dirtSpots.some(dirt => dirt.x == x && dirt.y == y)){
      return;
    }

    this.dirtSpots.push({id: this.dirtSpots.length, x: x, y: y})
    this.redefineProspective()
  }

  getPlantName(plant: Plant): string{
    if(plant.cycles < this.getMaxCycles(plant) / 2 && (plant.plantData == null || !plant.plantData.discovered)){
      return "Sprout"
    }
    if(plant.plantData == null){
      return "Inviable"
    }
    return plant.plantData.staticInfo.name
  }

  isInviable(plant: Plant): boolean{
    return (plant.cycles >= this.getMaxCycles(plant) / 2) && plant.plantData == null
  }

  redefineProspective(){
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

  getPlantFromDirt(dirt: Dirt): Plant | null{
    var matchingPlants = this.plants.filter(plant => plant.dirt == dirt)

    if(matchingPlants.length != 1){
      return null;
    }
    return matchingPlants[0]
  }

  makePlant(pattern: string, dirt: Dirt){
    var newPlant: Plant = {
      dirt: dirt,
      plantData: this.alamancTrackerService.checkSeedPattern(pattern), 
      plantedPattern: pattern, 
      cycles: 0, 
      waterCycles: 0
    };

    this.plants.push(newPlant);
  }

  harvestPlant(plant: Plant){
    this.plants = this.plants.filter(x => x != plant)

    console.log(plant)
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

  getMaxCycles(plant: Plant): number{
    if(plant.plantData != null){
      return plant.plantData.staticInfo.patternSize * 10 + (plant.plantData.staticInfo.growthCyclesAdjustment ? plant.plantData.staticInfo.growthCyclesAdjustment : 0)
    }
    return plant.plantedPattern.length * 10
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
      if(plant.cycles < this.getMaxCycles(plant) && !this.isInviable(plant) && plant.waterCycles > 0){
        plant.waterCycles -= 1
        plant.cycles += 1
      }
    })

    this.saveManagementService.saveGame()
  }
}
