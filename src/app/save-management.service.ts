import { Injectable } from '@angular/core';
import { Plant, SaveableDirt, SaveablePlant, SaveablePlantData, StaticPlantData } from 'src/interfaces/plant';
import { GrowingPlantsService } from './growing-plants.service';
import { AlmanacTrackerService } from './almanac-tracker.service';
import { SeedCombinationsService } from './seed-combinations.service';
import { SaveableInventory, SaveableQuest, SaveableSeed, SaveableTool } from 'src/interfaces/seed';
import { DataLoaderService } from './data-loader.service';
import { QuestService } from './quest.service';

@Injectable({
  providedIn: 'root'
})
export class SaveManagementService {
  stopSaving = false;

  settings: Record<string, any> = {
    "holdControl": true
  }

  constructor(
    private growingPlantService: GrowingPlantsService,
    private almanacTrackerService: AlmanacTrackerService,
    private seedCombinationService: SeedCombinationsService,
    private questService: QuestService) {
      growingPlantService.saveManagementService = this;
      almanacTrackerService.saveManagementService = this;
      seedCombinationService.saveManagementService = this;
  }

  clearData(){
    this.stopSaving = true;
    localStorage.clear()
    location.reload();
  }

  getSetting(settingName: string): any {
    if(this.settings[settingName] == null){
      return null
    }
    return this.settings[settingName]
  }

  toggleSetting(settingName: string){
    var currentSetting = this.settings[settingName]
    if(currentSetting != null){
      this.settings[settingName] = !currentSetting
    }
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
        timer: tool.timer,
        level: tool.level
      })
    })
    localStorage.setItem("savedTools", JSON.stringify(saveableTools))

    var saveableInventory: SaveableInventory = {
      experience: this.seedCombinationService.experience,
      money: this.seedCombinationService.money
    }
    localStorage.setItem("savedInventory", JSON.stringify(saveableInventory))

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

    //// /////////
    ///  SAVE COMPLETED QUESTS
    /// ///////////
    var saveableQuestData: Array<SaveableQuest> = []
    this.questService.quests.forEach(quest => {
      saveableQuestData.push({
        questDataID: quest.questData.id,
        seenTriggers: quest.seenTriggers,
        completed: quest.completed,
        active: quest.active
      })
    })

    localStorage.setItem("savedAchievements", JSON.stringify(this.questService.acquiredAchivements))
    localStorage.setItem("savedQuestData", JSON.stringify(saveableQuestData))

    //// ////////////
    //// SAVE SETTINGS
    //// ///////////
    localStorage.setItem("savedSettings", JSON.stringify(this.settings))
  }

  attemptLoad(staticPlantData: Array<StaticPlantData>){
    var loadedSaveSuccessfully = false;

    var attemptLoadPlants = localStorage.getItem("savedPlants")
    var attemptLoadDirt = localStorage.getItem("savedDirt")
    var attemptLoadSeeds = localStorage.getItem("savedSeeds")
    var attemptLoadPlantData = localStorage.getItem("savedPlantData")
    var attemptLoadFailedPatterns = localStorage.getItem("savedFailedPatterns")
    var attemptLoadTools = localStorage.getItem("savedTools")
    var attemptLoadInventory = localStorage.getItem("savedInventory")
    var attemptLoadAchievements = localStorage.getItem("savedAchievements")
    var attemptLoadQuestData = localStorage.getItem("savedQuestData")
    var attemptLoadSettings = localStorage.getItem("savedSettings")

    if(attemptLoadPlants && attemptLoadDirt && attemptLoadSeeds && 
      attemptLoadPlantData && attemptLoadFailedPatterns && attemptLoadTools && attemptLoadInventory && 
      attemptLoadAchievements && attemptLoadQuestData && attemptLoadSettings){
      loadedSaveSuccessfully = true
      
      var loadedSeeds = JSON.parse(attemptLoadSeeds) as Array<SaveableSeed>;
      var loadedTools = JSON.parse(attemptLoadTools) as Array<SaveableTool>;
      var loadedInventory = JSON.parse(attemptLoadInventory) as SaveableInventory;
      var seedLoadedSuccessfully = this.seedCombinationService.onLoadSave(loadedSeeds, loadedTools, loadedInventory);
      if(!seedLoadedSuccessfully){
        console.log("Seed loaded unsuccessfully")
        loadedSaveSuccessfully = false
      }

      if(loadedSaveSuccessfully){
        var loadedPlantData = JSON.parse(attemptLoadPlantData) as Array<SaveablePlantData>
        var loadedFailedPatterns = JSON.parse(attemptLoadFailedPatterns) as Array<string>
        var almanacLoadedSuccessfully = this.almanacTrackerService.onLoadSave(staticPlantData, loadedPlantData, loadedFailedPatterns)

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

      if(loadedSaveSuccessfully){
        var loadedAchievements = JSON.parse(attemptLoadAchievements) as Array<string>
        var loadedQuestData = JSON.parse(attemptLoadQuestData) as Array<SaveableQuest>
        var questsLoadedSuccessfully = this.questService.onLoadSave(loadedAchievements, loadedQuestData)

        if(!questsLoadedSuccessfully){
          console.log("Quests loaded unsuccessfully")
          loadedSaveSuccessfully = false
        }

        if(!loadedSaveSuccessfully){
          this.clearData()
        }
      }

      if(loadedSaveSuccessfully){
        var loadedSettings = JSON.parse(attemptLoadSettings) as Record<string,any>  
        for(const key in loadedSettings){
          this.settings[key] = loadedSettings[key]
        }
      }
    }

    if(!loadedSaveSuccessfully){
      this.growingPlantService.onNoSave();
      this.seedCombinationService.onNoSave();
      this.almanacTrackerService.onNoSave(staticPlantData);
      this.questService.onNoLoadSave()
    }

    this.growingPlantService.startRunning()
    this.seedCombinationService.startRunning()
  }
}
