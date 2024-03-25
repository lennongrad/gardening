import { Component, Input, OnInit } from '@angular/core';
import { AlmanacTrackerService } from '../almanac-tracker.service';
import { PlantData } from 'src/interfaces/plant';
import { PatternAttempt, Seed, SeedData } from 'src/interfaces/seed';
import { SeedCombinationsService } from '../seed-combinations.service';
import { DebugService } from '../debug.service';
import { GrowingPlantsService } from '../growing-plants.service';

@Component({
  selector: 'app-almanac',
  templateUrl: './almanac.component.html',
  styleUrls: ['./almanac.component.less']
})
export class AlmanacComponent implements OnInit {
  sortingID: string | null = null;

  @Input() activeWindow: boolean = false;

  lastCalculatedSeeds: Array<Array<PatternAttempt>> = []
  lastCalculatedSeedsPlantID: string = ""
  lastCalculatedWordles: Array<0|1|2> = []

  constructor(
    private almanacTrackerService: AlmanacTrackerService,
    private seedCombinationService: SeedCombinationsService,
    private growingPlantService: GrowingPlantsService,
    private debugService: DebugService) { }

  ngOnInit(): void {
    //this.almanacTrackerService.selectedPlant = this.almanacTrackerService.plantList.slice(-1)[0]
  }

  getPlants(): Array<PlantData>{
    var plants = [...this.almanacTrackerService.plantList]
    var modifiedID = this.sortingID
    var wasBackwards = false

    if(this.sortingID != null && this.sortingID.slice(-1) == "!"){
      modifiedID = this.sortingID.slice(0,-1)
      wasBackwards = true
    }

    switch(modifiedID){
      case 'Name': plants.sort((x,y) => {
        return (x.staticInfo.name < y.staticInfo.name) ? -1 : 1
      }); break;
      case 'Family': plants.sort((x,y) => {
        return (x.staticInfo.family < y.staticInfo.family) ? -1 : 1
      }); break;
      case 'Pattern': plants.sort((x,y) => {
        return x.pattern.length - y.pattern.length
      }); break;
      case 'XP': plants.sort((x,y) => {
        return (this.getXP(x) > this.getXP(y)) ? -1 : 1
      }); break;
    }

    this.getSeedTypes().forEach(seed => {
      if(modifiedID == seed.seed.id){
        plants.sort((x,y) => {
          return Number(this.getSeedYields(y, seed))  - Number(this.getSeedYields(x, seed)) 
        }); 
      }
    })

    if(wasBackwards){
      plants.reverse()
    }

    return plants
  }

  getSeedIcon(seed: Seed | null): string{
    if(seed == null){
      return "unknown_seed.png"
    }
    return seed?.seed.icon
  }

  getPatternSeeds(plant: PlantData): Array<Seed | null>{
    var combo = this.seedCombinationService.getSeedsByPattern(plant.pattern)
    if(!plant.discovered && !this.debugService.getDebugSetting('showAllPlants')){
      return [].constructor(combo.length)
    }
    return combo
  }

  getShadowSeeds(plant: PlantData): Array<null>{
    var count = this.seedCombinationService.getMaxSeedAmount() - this.getPatternSeeds(plant).length
    return [].constructor(count)
  }

  getSeedTypes(): Array<Seed>{
    return this.seedCombinationService.seeds
  }

  getSelectedPlant(): PlantData | null{
    return this.almanacTrackerService.selectedPlant
  }

  getSortedSymbol(id: string): string{
    if(id == this.sortingID){
      return "↑"
    }
    if (id + "!" == this.sortingID){
      return "↓"
    }
    return ""
  }

  getRowStyle(plant: PlantData, index: number): Record<string, any>{
    if(this.getSelectedPlant() == null){
      return {}
    }

    var base: Record<string,any> = {
      "transform": "translateY(-" + (index * 26) + "px)"
    }

    if(this.getSelectedPlant() != plant){
      base["transform"] += " scaleY(0)"
    }

    return base
  }
  
  getXP(plant: PlantData): string{
    if(!plant.discovered){
      return ""
    }
    return (plant.pattern.length * 100).toString() + "k"
  }

  getSeedYields(plant: PlantData, seed: Seed): string{
    if(!plant.discovered){
      return ""
    }

    var yields = this.growingPlantService.getYieldedSeeds(plant)
    var matchedYield = -1

    yields.forEach(pair => {
      if(pair[0] == seed.seed){
        matchedYield = pair[1]
      }
    })

    if(matchedYield == -1){
      return "";
    }
    return matchedYield.toString();
  }

  getAttemptedPatterns(): Array<Array<PatternAttempt>>{
    if(this.getSelectedPlant() == null){
      return []
    }

    if(this.lastCalculatedSeedsPlantID != this.getSelectedPlant()?.staticInfo.id || this.lastCalculatedSeeds.length != this.getSelectedPlant()?.attemptedPatterns.length){
      this.lastCalculatedSeeds = this.almanacTrackerService.getAttemptedSeeds(this.getSelectedPlant()!)
      this.lastCalculatedSeedsPlantID = this.getSelectedPlant()?.staticInfo.id!
    }

    return this.lastCalculatedSeeds
  }

  clickSort(id: string){
    if(this.sortingID == id + "!"){
      this.sortingID = null
    } else if(this.sortingID == id){
      this.sortingID = id + "!"
    } else{
      this.sortingID = id
    }

    this.getPlants()
  }

  clickPlant(plant: PlantData){
    if(this.almanacTrackerService.selectedPlant == plant){
      this.almanacTrackerService.selectedPlant = null
    } else {
      this.almanacTrackerService.selectedPlant = plant
    }
  }

}
