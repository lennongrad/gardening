import { Injectable } from '@angular/core';
import { Plant, SaveableDirt, SaveablePlant, SaveablePlantData } from 'src/interfaces/plant';
import { GrowingPlantsService } from './growing-plants.service';
import { AlmanacTrackerService } from './almanac-tracker.service';
import { SeedCombinationsService } from './seed-combinations.service';
import { SaveableSeed, SaveableTool } from 'src/interfaces/seed';

@Injectable({
  providedIn: 'root'
})
export class SaveManagementService {
  stopSaving = false;

  constructor(
    private growingPlantService: GrowingPlantsService,
    private almanacTrackerService: AlmanacTrackerService,
    private seedCombinationService: SeedCombinationsService) {
      growingPlantService.saveManagementService = this;
      almanacTrackerService.saveManagementService = this;
      seedCombinationService.saveManagementService = this;
  }

  clearData(){
    this.stopSaving = true;
    localStorage.clear()
    location.reload();
  }

  saveGame(){
    if(this.stopSaving){
      return;
    }

    /// /////////
    /// SAVE PLANT AND DIRT
    /// /////////
    var saveablePlants: Array<SaveablePlant> = [];
    this.growingPlantService.plants.forEach(plant => {
      saveablePlants.push({
        dirtID: plant.dirt.id,
        plantedPattern: plant.plantedPattern,
        cycles: plant.cycles,
        waterCycles: plant.waterCycles
      })
    })

    var saveableDirt: Array<SaveableDirt> = [];
    this.growingPlantService.dirtSpots.forEach(dirt => {
      saveableDirt.push({
          id: dirt.id,
          x: dirt.x,
          y: dirt.y
      })
    })

    localStorage.setItem("savedPlants", JSON.stringify(saveablePlants))
    localStorage.setItem("savedDirt", JSON.stringify(saveableDirt))

    /// ///////
    /// SAVE INVENTORY
    /// //////
    var saveableSeeds: Array<SaveableSeed> = [];
    this.seedCombinationService.seeds.forEach(seed => {
      saveableSeeds.push({
        seedID: seed.seed.id,
        amount: seed.amount,
        discovered: seed.discovered
      })
    })

    localStorage.setItem("savedSeeds", JSON.stringify(saveableSeeds))

    var saveableTools: Array<SaveableTool> = [];
    this.seedCombinationService.tools.forEach(tool => {
      saveableTools.push({
        toolID: tool.tool.id,
        timer: tool.timer
      })
    })
    localStorage.setItem("savedTools", JSON.stringify(saveableTools))

    /// //////
    /// SAVE DISCOVERED PLANTS/PATTERNS
    /// //////
    var saveablePlantData: Array<SaveablePlantData> = []
    this.almanacTrackerService.plantList.forEach(plantData => {
      saveablePlantData.push({
        plantDataID: plantData.staticInfo.id,
        pattern: plantData.pattern,
        discovered: plantData.discovered,
        attemptedPatterns: plantData.attemptedPatterns
      })
    })

    var saveableFailedPatterns: Array<string> = Array.from(this.almanacTrackerService.failedCombinations)

    localStorage.setItem("savedPlantData", JSON.stringify(saveablePlantData))
    localStorage.setItem("savedFailedPatterns", JSON.stringify(saveableFailedPatterns))
  }

  attemptLoad(){
    var loadedSaveSuccessfully = false;

    var attemptLoadPlants = localStorage.getItem("savedPlants")
    var attemptLoadDirt = localStorage.getItem("savedDirt")
    var attemptLoadSeeds = localStorage.getItem("savedSeeds")
    var attemptLoadPlantData = localStorage.getItem("savedPlantData")
    var attemptLoadFailedPatterns = localStorage.getItem("savedFailedPatterns")
    var attemptLoadTools = localStorage.getItem("savedTools")

    if(attemptLoadPlants && attemptLoadDirt && attemptLoadSeeds && attemptLoadPlantData && attemptLoadFailedPatterns && attemptLoadTools){
      loadedSaveSuccessfully = true
      
      var loadedSeeds = JSON.parse(attemptLoadSeeds) as Array<SaveableSeed>;
      var loadedTools = JSON.parse(attemptLoadTools) as Array<SaveableTool>;
      var seedLoadedSuccessfully = this.seedCombinationService.onLoadSave(loadedSeeds, loadedTools);
      if(!seedLoadedSuccessfully){
        console.log("Seed loaded unsuccessfully")
        loadedSaveSuccessfully = false
      }

      if(loadedSaveSuccessfully){
        var loadedPlantData = JSON.parse(attemptLoadPlantData) as Array<SaveablePlantData>
        var loadedFailedPatterns = JSON.parse(attemptLoadPlantData) as Array<string>
        var almanacLoadedSuccessfully = this.almanacTrackerService.onLoadSave(loadedPlantData, loadedFailedPatterns)

        if(!almanacLoadedSuccessfully){
          console.log("Almanac loaded unsuccessfully")
          loadedSaveSuccessfully = false
        }
      }

      if(loadedSaveSuccessfully){
        var loadedPlants = JSON.parse(attemptLoadPlants) as Array<SaveablePlant>
        var loadedDirt = JSON.parse(attemptLoadDirt) as Array<SaveableDirt>;
        var plantsLoadedSuccessfully = this.growingPlantService.onLoadSave(loadedDirt, loadedPlants);

        if(!plantsLoadedSuccessfully){
          console.log("Plants loaded unsuccessfully")
          loadedSaveSuccessfully = false
        }

        if(!loadedSaveSuccessfully){
          this.clearData()
        }
      }
    }

    if(!loadedSaveSuccessfully){
      this.growingPlantService.onNoSave();
      this.seedCombinationService.onNoSave();
      this.almanacTrackerService.onNoSave();
    }
  }
}
