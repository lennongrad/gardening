import { Component, Input, OnInit } from '@angular/core';
import { AlmanacTrackerService } from '../almanac-tracker.service';
import { PlantData } from 'src/interfaces/plant';
import { Seed, SeedData } from 'src/interfaces/seed';
import { SeedCombinationsService } from '../seed-combinations.service';
import { DebugService } from '../debug.service';
import { GrowingPlantsService } from '../growing-plants.service';

@Component({
  selector: 'app-almanac',
  templateUrl: './almanac.component.html',
  styleUrls: ['./almanac.component.less']
})
export class AlmanacComponent implements OnInit {
  

  @Input() activeWindow: boolean = false;

  constructor(
    private almanacTrackerService: AlmanacTrackerService,
    private seedCombinationService: SeedCombinationsService,
    private growingPlantService: GrowingPlantsService,
    private debugService: DebugService) { }

  ngOnInit(): void {
  }

  getPlants(): Array<PlantData>{
    return this.almanacTrackerService.plantList
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

  getSeedYields(plant: PlantData, seed: Seed): string{
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

  clickPlant(plant: PlantData){
    if(this.almanacTrackerService.selectedPlant == plant){
      this.almanacTrackerService.selectedPlant = null
    } else {
      this.almanacTrackerService.selectedPlant = plant
    }
  }

}
